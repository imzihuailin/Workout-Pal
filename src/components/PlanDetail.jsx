import { useState, useRef, useEffect } from 'react'

function PlanDetail({ plan, onUpdatePlan, onBack, onDeletePlan, onDeleteExercise }) {
  const [planName, setPlanName] = useState(plan.name)
  const [originalPlanName, setOriginalPlanName] = useState(plan.name)
  const [exerciseName, setExerciseName] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [rpe, setRpe] = useState('')
  const [duration, setDuration] = useState('')
  const [editingExerciseId, setEditingExerciseId] = useState(null)

  const normalizeField = (value) => {
    if (value === '-' || value === null || value === undefined) return ''
    return String(value)
  }

  const trimOrDash = (value) => {
    const trimmed = normalizeField(value).trim()
    return trimmed || '-'
  }

  // 当plan变化时更新planName和originalPlanName（仅在切换不同计划时重置）
  useEffect(() => {
    setPlanName(plan.name)
    setOriginalPlanName(plan.name)
  }, [plan.id])

  // 处理计划名称变更（保留自动保存功能）
  const handlePlanNameChange = (e) => {
    const newName = e.target.value
    setPlanName(newName)
    const updatedPlan = {
      ...plan,
      name: newName
    }
    onUpdatePlan(updatedPlan)
  }

  // 确认计划名称更改
  const handleConfirmPlanName = () => {
    setOriginalPlanName(planName)
  }

  // 处理计划名称输入框的回车键
  const handlePlanNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (planName !== originalPlanName) {
        handleConfirmPlanName()
      }
    }
  }

  // 处理删除计划
  const handleDeletePlan = () => {
    onDeletePlan(plan.id)
  }

  const nameRef = useRef(null)
  const setsRef = useRef(null)
  const repsRef = useRef(null)
  const weightRef = useRef(null)
  const rpeRef = useRef(null)
  const durationRef = useRef(null)

  // 清除表单
  const clearForm = () => {
    setExerciseName('')
    setSets('')
    setReps('')
    setWeight('')
    setRpe('')
    setDuration('')
    setEditingExerciseId(null)
  }

  // 编辑动作：将动作信息填入表单
  const handleEditExercise = (exercise) => {
    setExerciseName(normalizeField(exercise.name))
    setSets(normalizeField(exercise.sets))
    setReps(normalizeField(exercise.reps))
    setWeight(normalizeField(exercise.weight))
    setRpe(normalizeField(exercise.rpe))
    setDuration(normalizeField(exercise.duration))
    setEditingExerciseId(exercise.id)
    // 聚焦到第一个输入框
    setTimeout(() => nameRef.current?.focus(), 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (exerciseName.trim()) {
      const exerciseData = {
        name: trimOrDash(exerciseName),
        sets: trimOrDash(sets),
        reps: trimOrDash(reps),
        weight: trimOrDash(weight),
        rpe: trimOrDash(rpe),
        duration: trimOrDash(duration)
      }

      let updatedPlan
      if (editingExerciseId) {
        // 更新现有动作
        updatedPlan = {
          ...plan,
          exercises: plan.exercises.map(ex =>
            ex.id === editingExerciseId
              ? { ...ex, ...exerciseData }
              : ex
          )
        }
      } else {
        // 添加新动作
        const newExercise = {
          id: Date.now().toString(),
          ...exerciseData
        }
        updatedPlan = {
          ...plan,
          exercises: [...plan.exercises, newExercise]
        }
      }
      
      onUpdatePlan(updatedPlan)
      clearForm()
    }
  }

  const handleSaveClick = (e) => {
    handleSubmit(e)
  }

  const handleDeleteExercise = (e, exerciseId, index) => {
    e.stopPropagation() // 阻止事件冒泡，避免触发编辑
    onDeleteExercise(plan.id, exerciseId, index)
    // 如果删除的是正在编辑的动作，清除表单
    if (exerciseId === editingExerciseId) {
      clearForm()
    }
  }

  // 上移动作
  const handleMoveUp = (e, index) => {
    e.stopPropagation()
    if (index === 0) return
    const newExercises = [...plan.exercises]
    const temp = newExercises[index]
    newExercises[index] = newExercises[index - 1]
    newExercises[index - 1] = temp
    onUpdatePlan({ ...plan, exercises: newExercises })
  }

  // 下移动作
  const handleMoveDown = (e, index) => {
    e.stopPropagation()
    if (index === plan.exercises.length - 1) return
    const newExercises = [...plan.exercises]
    const temp = newExercises[index]
    newExercises[index] = newExercises[index + 1]
    newExercises[index + 1] = temp
    onUpdatePlan({ ...plan, exercises: newExercises })
  }

  // 处理回车键，跳转到下一个输入框
  const handleKeyDown = (e, currentField) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (currentField === 'name') {
        setsRef.current?.focus()
      } else if (currentField === 'sets') {
        repsRef.current?.focus()
      } else if (currentField === 'reps') {
        weightRef.current?.focus()
      } else if (currentField === 'weight') {
        rpeRef.current?.focus()
      } else if (currentField === 'rpe') {
        durationRef.current?.focus()
      } else if (currentField === 'duration') {
        // 最后一个输入框，执行提交
        handleSubmit(e)
      }
    }
  }

  return (
    <div>
      {/* 返回按钮和删除按钮 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onBack}
            className="text-blue-500 font-medium"
          >
            ← 返回
          </button>
          <button
            onClick={handleDeletePlan}
            className="text-red-500 font-medium"
          >
            删除计划
          </button>
        </div>
        {/* 计划名称输入框和确定按钮 */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={planName}
            onChange={handlePlanNameChange}
            onKeyDown={handlePlanNameKeyDown}
            className="flex-1 text-2xl font-bold text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {planName !== originalPlanName && (
            <button
              onClick={handleConfirmPlanName}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
            >
              确定
            </button>
          )}
        </div>
      </div>

      {/* 添加动作表单 */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
          <input
            ref={nameRef}
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'name')}
            placeholder="动作名称"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            ref={setsRef}
            type="text"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'sets')}
            placeholder="组数"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            ref={repsRef}
            type="text"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'reps')}
            placeholder="次数"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            ref={weightRef}
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'weight')}
            placeholder="重量(kg)"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            ref={rpeRef}
            type="text"
            value={rpe}
            onChange={(e) => setRpe(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'rpe')}
            placeholder="RPE"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            ref={durationRef}
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'duration')}
            placeholder="时间"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {editingExerciseId && (
            <button
              type="button"
              onClick={clearForm}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              取消
            </button>
          )}
          <button
            type="submit"
            onClick={handleSaveClick}
            className={`${editingExerciseId ? 'flex-1' : 'w-full'} px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {editingExerciseId ? '保存修改' : '添加动作'}
          </button>
        </div>
      </form>

      {/* 动作列表 */}
      <div className="space-y-3">
        {plan.exercises.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded-lg">
            还没有动作，添加一个吧！
          </div>
        ) : (
          plan.exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              onClick={() => handleEditExercise(exercise)}
              className={`bg-white p-4 rounded-lg shadow-sm border flex justify-between items-start cursor-pointer transition-colors ${
                editingExerciseId === exercise.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{exercise.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>组数: {exercise.sets}</div>
                  <div>次数: {exercise.reps}</div>
                  <div>重量: {exercise.weight} kg</div>
                  <div>RPE: {exercise.rpe}</div>
                  <div>时间: {exercise.duration || '-'}</div>
                </div>
              </div>
              <div className="ml-4 flex flex-col gap-1">
                {index > 0 && (
                  <button
                    onClick={(e) => handleMoveUp(e, index)}
                    className="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    ↑
                  </button>
                )}
                {index < plan.exercises.length - 1 && (
                  <button
                    onClick={(e) => handleMoveDown(e, index)}
                    className="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    ↓
                  </button>
                )}
                <button
                  onClick={(e) => handleDeleteExercise(e, exercise.id, index)}
                  className="px-3 py-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PlanDetail

