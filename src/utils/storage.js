const STORAGE_KEY = 'fitness-plans'

// 保存计划数组到 Local Storage
export function savePlans(plans) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  } catch (error) {
    console.error('保存计划失败:', error)
  }
}

// 从 Local Storage 读取计划数组
export function getPlans() {
  try {
    const plansJson = localStorage.getItem(STORAGE_KEY)
    return plansJson ? JSON.parse(plansJson) : []
  } catch (error) {
    console.error('读取计划失败:', error)
    return []
  }
}




