let cartData:any = [];
let datas=[]
console.log('second');
if (typeof window !== 'undefined') {
    cartData = JSON.parse(localStorage.getItem('cart'));
    if(cartData){
      const newCartItems = cartData.data.items.map((items) => ({
        id: items.productId as number | string,
        slug: items.slug as string,
        price: items.supplies[0].mrp - items.supplies[0].off,
        imgUrl: items.imageUrl,
        name: items.name,
        qty: items.quantity,
        productVariant: items.variantId,
        maxQuantity:items.supplies[0].quantity
      }));
     
    cartData=newCartItems;
    }
  
}

export const INITIAL_CART = cartData;


