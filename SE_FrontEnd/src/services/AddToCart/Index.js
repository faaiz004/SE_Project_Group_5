export const addToCart = ({ _id, name, brand, size, category, price, imageUrl, quantity = 1 }) => {
    const existingCart = JSON.parse(sessionStorage.getItem('cart')) || [];

    const newItem = {
        productId: _id,
        name,
        brand,
        size,
        category,
        price,
        imageUrl,
        quantity
    };

    existingCart.push(newItem);
    sessionStorage.setItem('cart', JSON.stringify(existingCart));
};
export const removeFromCart = (productId) => {
    const existingCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const updatedCart = existingCart.filter(item => item.productId !== productId);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
};