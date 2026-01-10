import { useState, useEffect } from 'react'
import PlanList from './components/PlanList'
import PlanDetail from './components/PlanDetail'
import PlanView from './components/PlanView'
import { getPlans, savePlans } from './utils/storage'

function App() {
  const [plans, setPlans] = useState([])
  const [currentView, setCurrentView] = useState('list')
  const [selectedPlanId, setSelectedPlanId] = useState(null)

  // 组件加载时从 Local Storage 读取计划
  useEffect(() => {
    const loadedPlans = getPlans()
    setPlans(loadedPlans)
  }, [])

  // 添加新计划
  const handleAddPlan = (name) => {
    const newPlan = {
      id: Date.now().toString(),
      name: name,
      exercises: []
    }
    const updatedPlans = [...plans, newPlan]
    setPlans(updatedPlans)
    savePlans(updatedPlans)
  }

  // 查看计划（查看模式）
  const handleViewPlan = (planId) => {
    setSelectedPlanId(planId)
    setCurrentView('view')
  }

  // 编辑计划（从查看模式切换到编辑模式）
  const handleEditPlan = () => {
    setCurrentView('detail')
  }

  // 返回查看模式（从编辑模式返回）
  const handleBackToView = () => {
    setCurrentView('view')
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

  // 删除计划
  const handleDeletePlan = (planId) => {
    const updatedPlans = plans.filter(plan => plan.id !== planId)
    setPlans(updatedPlans)
    savePlans(updatedPlans)
    // 如果删除的是当前选中的计划，返回列表
    if (selectedPlanId === planId) {
      setCurrentView('list')
      setSelectedPlanId(null)
    }
  }

  const selectedPlan = plans.find(plan => plan.id === selectedPlanId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">健身计划</h1>
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
            />
          )
        )}
      </main>
    </div>
  )
}

export default App

