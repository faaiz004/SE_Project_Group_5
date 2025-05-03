import '../config/env.js'; // ✅ this ensures env vars are loaded
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



export const purchaseItems = async (req, res, next) => {
  try {
    const { cartItems } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or invalid.' });
    }

    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Price in cents
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: 'http://localhost:3000/order-confirmation', // update if needed
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Error:', err);
    res.status(500).json({ error: 'Stripe checkout failed' });
  }
};
