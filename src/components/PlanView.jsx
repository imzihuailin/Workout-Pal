function PlanView({ plan, onBack, onEdit }) {
  return (
    <div>
      {/* 返回按钮和计划名称 */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="mb-4 text-blue-500 hover:text-blue-600 font-medium"
        >
          ← 返回列表
        </button>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            编辑
          </button>
        </div>
      </div>

      {/* 动作列表 */}
      <div className="space-y-4">
        {plan.exercises.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white rounded-lg">
            还没有动作
          </div>
        ) : (
          plan.exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {exercise.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
                <div>
                  <span className="text-sm text-gray-500">组数</span>
                  <div className="text-lg font-semibold">{exercise.sets}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">次数</span>
                  <div className="text-lg font-semibold">{exercise.reps}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">重量</span>
                  <div className="text-lg font-semibold">{exercise.weight} kg</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">RPE</span>
                  <div className="text-lg font-semibold">{exercise.rpe}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PlanView




