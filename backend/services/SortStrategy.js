/**
 * Strategy Pattern: sorting for auctions (matches user's controller keys).
 */
class SortStrategy { getSortSpec(){ throw new Error('override'); } }

class SortByCreatedAtDesc extends SortStrategy { getSortSpec(){ return { createdAt: -1 }; } }
class SortByCreatedAtAsc  extends SortStrategy { getSortSpec(){ return { createdAt:  1 }; } }
class SortByPriceDesc     extends SortStrategy { getSortSpec(){ return { currentPrice: -1 }; } }
class SortByPriceAsc      extends SortStrategy { getSortSpec(){ return { currentPrice:  1 }; } }
class SortByEndDateAsc    extends SortStrategy { getSortSpec(){ return { endDate: 1 }; } }

function sortStrategyFactory(key='createdAt_desc'){
  switch(key){
    case 'createdAt_asc':     return new SortByCreatedAtAsc();
    case 'currentPrice_desc': return new SortByPriceDesc();
    case 'currentPrice_asc':  return new SortByPriceAsc();
    case 'endDate_asc':       return new SortByEndDateAsc();
    default:                  return new SortByCreatedAtDesc();
  }
}

module.exports = { sortStrategyFactory };