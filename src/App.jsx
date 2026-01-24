import { useState, useEffect, useRef } from 'react'
import PlanList from './components/PlanList'
import PlanDetail from './components/PlanDetail'
import PlanView from './components/PlanView'
import { getPlans, savePlans } from './utils/storage'

function App() {
  const [plans, setPlans] = useState([])
  const [currentView, setCurrentView] = useState('list')
  const [selectedPlanId, setSelectedPlanId] = useState(null)
  const [isNewPlan, setIsNewPlan] = useState(false)
  const [deletedItems, setDeletedItems] = useState([]) // 最多保存3个删除记录
  const timerRefs = useRef([]) // 保存定时器引用

  // 组件加载时从 Local Storage 读取计划
  useEffect(() => {
    const loadedPlans = getPlans()
    setPlans(loadedPlans)
  }, [])

  // 添加新计划
  const handleAddPlan = (name = '新计划') => {
    const newPlan = {
      id: Date.now().toString(),
      name: name,
      exercises: []
    }
    const updatedPlans = [...plans, newPlan]
    setPlans(updatedPlans)
    savePlans(updatedPlans)
    // 创建后直接跳转到编辑页面
    setSelectedPlanId(newPlan.id)
    setCurrentView('detail')
    setIsNewPlan(true)
  }

  // 查看计划（查看模式）
  const handleViewPlan = (planId) => {
    setSelectedPlanId(planId)
    setCurrentView('view')
    setIsNewPlan(false)
  }

  // 编辑计划（从查看模式切换到编辑模式）
  const handleEditPlan = () => {
    setCurrentView('detail')
  }

  // 返回查看模式（从编辑模式返回）
  const handleBackToView = () => {
    // 如果是新计划且没有添加任何动作，删除该计划
    if (isNewPlan && selectedPlan && selectedPlan.exercises.length === 0) {
      const updatedPlans = plans.filter(plan => plan.id !== selectedPlanId)
      setPlans(updatedPlans)
      savePlans(updatedPlans)
      setCurrentView('list')
      setSelectedPlanId(null)
    } else {
      setCurrentView('view')
    }
    setIsNewPlan(false)
  }

  // 返回列表
  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedPlanId(null)
  }

  // 更新计划
  const handleUpdatePlan = (updatedPlan) => {
    const updatedPlans = plans.map(plan => 
      plan.id === updatedPlan.id ? updatedPlan : plan
    )
    setPlans(updatedPlans)
    savePlans(updatedPlans)
  }

  // 添加删除记录
  const addDeletedItem = (item) => {
    const itemWithTimestamp = { ...item, timestamp: Date.now() }
    setDeletedItems(prev => {
      const newItems = [itemWithTimestamp, ...prev].slice(0, 3) // 最多保存3个
      return newItems
    })
    // 设置1分钟后自动清除该记录
    const timerId = setTimeout(() => {
      setDeletedItems(prev => prev.filter(i => i.timestamp !== itemWithTimestamp.timestamp))
    }, 60000)
    timerRefs.current.push(timerId)
  }

  // 撤销删除
  const handleUndo = () => {
    if (deletedItems.length === 0) return
    
    const [lastDeleted, ...rest] = deletedItems
    setDeletedItems(rest)

    if (lastDeleted.type === 'plan') {
      // 恢复计划
      const newPlans = [...plans]
      newPlans.splice(lastDeleted.index, 0, lastDeleted.data)
      setPlans(newPlans)
      savePlans(newPlans)
    } else if (lastDeleted.type === 'exercise') {
      // 恢复动作
      const updatedPlans = plans.map(plan => {
        if (plan.id === lastDeleted.planId) {
          const newExercises = [...plan.exercises]
          newExercises.splice(lastDeleted.index, 0, lastDeleted.data)
          return { ...plan, exercises: newExercises }
        }
        return plan
      })
      setPlans(updatedPlans)
      savePlans(updatedPlans)
    }
  }

  // 删除计划
  const handleDeletePlan = (planId) => {
    const planIndex = plans.findIndex(plan => plan.id === planId)
    const deletedPlan = plans[planIndex]
    
    // 保存删除记录
    addDeletedItem({
      type: 'plan',
      data: deletedPlan,
      index: planIndex
    })

    const updatedPlans = plans.filter(plan => plan.id !== planId)
    setPlans(updatedPlans)
    savePlans(updatedPlans)
    // 如果删除的是当前选中的计划，返回列表
    if (selectedPlanId === planId) {
      setCurrentView('list')
      setSelectedPlanId(null)
    }
  }

  // 删除动作
  const handleDeleteExercise = (planId, exerciseId, exerciseIndex) => {
    const plan = plans.find(p => p.id === planId)
    const deletedExercise = plan.exercises.find(ex => ex.id === exerciseId)
    
    // 保存删除记录
    addDeletedItem({
      type: 'exercise',
      data: deletedExercise,
      planId: planId,
      index: exerciseIndex
    })

    const updatedPlans = plans.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          exercises: p.exercises.filter(ex => ex.id !== exerciseId)
        }
      }
      return p
    })
    setPlans(updatedPlans)
    savePlans(updatedPlans)
  }

  const selectedPlan = plans.find(plan => plan.id === selectedPlanId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">健身计划</h1>
            {deletedItems.length > 0 && (
              <button
                onClick={handleUndo}
                className="px-4 py-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
              >
                撤销删除 ({deletedItems.length})
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'list' ? (
          <PlanList 
            plans={plans} 
            onAddPlan={handleAddPlan}
            onPlanClick={handleViewPlan}
          />
        ) : currentView === 'view' ? (
          selectedPlan && (
            <PlanView
              plan={selectedPlan}
              onBack={handleBackToList}
              onEdit={handleEditPlan}
            />
          )
        ) : (
          selectedPlan && (
            <PlanDetail
              plan={selectedPlan}
              onUpdatePlan={handleUpdatePlan}
              onBack={handleBackToView}
              onDeletePlan={handleDeletePlan}
              onDeleteExercise={handleDeleteExercise}
            />
          )
        )}
      </main>
    </div>
  )
}

export default App

