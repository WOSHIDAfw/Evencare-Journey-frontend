/**
 * 景点模拟数据 — 各推荐分组引用同一对象，避免重复
 * 坐标通过 geoService.enrichPlaceWithCoords 补充，不在此重复维护
 */

const placeMap = {
  wuhouci: {
    id: 'wuhouci',
    name: '武侯祠',
    city: '成都',
    district: '武侯区',
    rating: 4.8,
    image: '/static/images/place-placeholder.png',
    tags: ['适合长者', '步行较少', '卫生间便利'],
    visitMinutes: 90
  },
  dufu: {
    id: 'dufu',
    name: '杜甫草堂',
    city: '成都',
    district: '青羊区',
    rating: 4.7,
    image: '/static/images/place-placeholder.png',
    tags: ['文化景点', '休息便利', '适合长者'],
    visitMinutes: 90
  },
  kuanzhai: {
    id: 'kuanzhai',
    name: '宽窄巷子',
    city: '成都',
    district: '青羊区',
    rating: 4.6,
    image: '/static/images/place-placeholder.png',
    tags: ['路面平缓', '休息点多', '文化景点'],
    visitMinutes: 120
  },
  renmin: {
    id: 'renmin',
    name: '人民公园',
    city: '成都',
    district: '青羊区',
    rating: 4.5,
    image: '/static/images/place-placeholder.png',
    tags: ['路面平缓', '休息点多', '步行较少'],
    visitMinutes: 90
  },
  jinli: {
    id: 'jinli',
    name: '锦里',
    city: '成都',
    district: '武侯区',
    rating: 4.7,
    image: '/static/images/place-placeholder.png',
    tags: ['长者热门', '文化景点', '休息便利'],
    visitMinutes: 90
  },
  jinsha: {
    id: 'jinsha',
    name: '金沙遗址',
    city: '成都',
    district: '青羊区',
    rating: 4.8,
    image: '/static/images/place-placeholder.png',
    tags: ['长者热门', '文化景点', '适合长者'],
    visitMinutes: 120
  },
  qingcheng: {
    id: 'qingcheng',
    name: '青城山',
    city: '成都',
    district: '都江堰市',
    rating: 4.9,
    image: '/static/images/place-placeholder.png',
    tags: ['空气清新', '康养休闲', '适合散步'],
    visitMinutes: 180
  },
  huanhuaxi: {
    id: 'huanhuaxi',
    name: '浣花溪公园',
    city: '成都',
    district: '青羊区',
    rating: 4.6,
    image: '/static/images/place-placeholder.png',
    tags: ['空气清新', '适合散步', '休息点多'],
    visitMinutes: 90
  },
  botanic: {
    id: 'botanic',
    name: '成都植物园',
    city: '成都',
    district: '金牛区',
    rating: 4.5,
    image: '/static/images/place-placeholder.png',
    tags: ['康养休闲', '适合散步', '空气清新'],
    visitMinutes: 120
  }
}

function pickPlaces(items) {
  return items.map((item) => {
    const id = typeof item === 'string' ? item : item.id
    const base = placeMap[id]
    if (typeof item === 'string' || !item.tags) {
      return { ...base }
    }
    return { ...base, tags: item.tags }
  })
}

/** 为您推荐 */
export const recommendedPlaces = pickPlaces(['wuhouci', 'dufu', 'kuanzhai', 'renmin'])

/** 轻松游览 */
export const easyPlaces = pickPlaces([
  { id: 'renmin', tags: ['路面平缓', '休息点多', '步行较少'] },
  { id: 'kuanzhai', tags: ['路面平缓', '休息点多', '步行较少'] },
  { id: 'huanhuaxi', tags: ['路面平缓', '休息点多', '步行较少'] }
])

/** 康养推荐 */
export const wellnessPlaces = pickPlaces([
  { id: 'qingcheng', tags: ['空气清新', '适合散步', '康养休闲'] },
  { id: 'huanhuaxi', tags: ['空气清新', '适合散步', '康养休闲'] },
  { id: 'botanic', tags: ['空气清新', '适合散步', '康养休闲'] }
])

/** 长者热门 */
export const seniorPopularPlaces = pickPlaces([
  { id: 'jinli', tags: ['长者热门', '文化景点', '休息便利'] },
  { id: 'jinsha', tags: ['长者热门', '文化景点', '休息便利'] },
  { id: 'dufu', tags: ['长者热门', '文化景点', '休息便利'] },
  { id: 'wuhouci', tags: ['长者热门', '文化景点', '休息便利'] }
])

/** 搜索页 — 热门推荐 */
export const searchHotPlaces = pickPlaces(['wuhouci', 'dufu', 'renmin', 'kuanzhai', 'jinli'])

/** 搜索页 — 附近地点 */
export const searchNearbyPlaces = pickPlaces(['jinli', 'wuhouci', 'renmin'])

/** 景点选择页列表 */
export const selectPagePlaces = pickPlaces(['wuhouci', 'dufu', 'jinli', 'renmin', 'kuanzhai', 'jinsha'])

/** 今日出行模拟数据（首页展示，可被 finalTrip 覆盖） */
export const todayTrip = {
  title: '今日行程',
  route: '武侯祠 → 锦里 → 人民公园',
  departTime: '预计 10:30 出发',
  summary: '3 个地点 · 约 5.2 公里'
}

/** 当前用户与城市 */
export const userInfo = {
  name: '李明',
  city: '成都'
}

export { placeMap }
