import { reactive } from 'vue'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  isLoading: true,
  /** @type {import('./models/User.js').User} */
  user: {},

  /** @type {import('./models/Product.js').Product[]} */
  products: [],
  
  /** @type {import('./models/Stations.js').Stations[]} */
  stations: [],

  /** @type {import('./models/Product.js').Product} */
  activeProduct: null,
  
  /** @type {import('./models/Stations.js').Stations} */
  activeStation: null,
  
  /** @type {import('./models/Stations.js').Stations} */
  previousStation: null,

  quantityToMove: null,
})
