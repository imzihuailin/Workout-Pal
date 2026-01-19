function PlanList({ plans, onAddPlan, onPlanClick }) {
  const handleAddClick = () => {
    onAddPlan()
  }

  return (
    <div>
      {/* 添加计划按钮 */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleAddClick}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          添加计划
        </button>
      </div>

      {/* 计划列表 */}
      <div className="space-y-3">
        {plans.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            还没有计划，创建一个吧！
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => onPlanClick(plan.id)}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {plan.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {plan.exercises?.length || 0} 个动作
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PlanList

