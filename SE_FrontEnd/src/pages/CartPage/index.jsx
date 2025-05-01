// src/pages/Cart/CartPage.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, Divider, AppBar, Toolbar, Badge } from "@mui/material";
import { ArrowBack, Add, Remove } from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cartStyles } from "./styles";
import deleteIcon from "../../assets/Mannequin/delete_icon.jpeg";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonIcon from "@mui/icons-material/Person";

export default function CartPage() {
	const navigate = useNavigate();
	const styles = cartStyles;
	const location = useLocation();

	const handleContinueShopping = () => {
		const from = location.state?.from;
		if (from && from !== "/checkout") {
			navigate(from);
		} else {
			navigate("/explore"); // fallback if unknown or from checkout
		}
	};

	const [cartItems, setCartItems] = useState(() => {
		return JSON.parse(sessionStorage.getItem("cart")) || [];
	});

	const cartTotal = cartItems.reduce(
		(sum, item) => sum + item.price * (item.quantity || 1),
		0
	);

	const persist = (next) => {
		setCartItems(next);
		sessionStorage.setItem("cart", JSON.stringify(next));
	};

	const handleQuantityChange = (productId, delta) => {
		const next = cartItems.map((i) =>
			i.productId === productId
				? { ...i, quantity: Math.max(1, (i.quantity || 1) + delta) }
				: i
		);
		persist(next);
	};

	const handleRemove = (productId) => {
		const next = cartItems.filter((i) => i.productId !== productId);
		persist(next);
	};

	return (
		<>
			<AppBar position="static" color="default" elevation={0}>
				<Toolbar sx={{ justifyContent: "space-between" }}>
		  <Typography
			variant="h4"
			sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', transition: 'transform .2s', '&:hover': { transform: 'scale(1.03)' }, color: '#000000' }}
			onClick={() => navigate('/explore')}
		  >
			Swipe-Fit
		  </Typography>

					<IconButton onClick={() => navigate("/stylefeed")}>
						<GroupAddIcon />
					</IconButton>

					<Box sx={{ position: "relative", mx: 2 }}>
						<IconButton onClick={() => navigate("/cart")}>
							<Badge badgeContent={cartItems.length} color="error">
								<ShoppingCartIcon />
							</Badge>
						</IconButton>
					</Box>

					<IconButton onClick={() => navigate("/account")}>
						<PersonIcon />
					</IconButton>
				</Toolbar>
			</AppBar>

			<Box sx={styles.container}>
				{/* Continue Shopping */}
				<Button
					startIcon={<ArrowBack />}
					sx={styles.backButton}
					onClick={handleContinueShopping}
				>
					Continue Shopping
				</Button>

				<Divider sx={styles.divider} />

				{/* Header */}
				<Typography variant="h5" sx={styles.title}>
					Shopping Cart
				</Typography>
				<Typography sx={styles.subtitle}>
					You have {cartItems.length} item
					{cartItems.length !== 1 ? "s" : ""} in your cart
				</Typography>

				{/* Empty state */}
				{cartItems.length === 0 && (
					<Typography sx={{ mt: 4, textAlign: "center" }}>
						No items in cart.
					</Typography>
				)}

				{/* Items list */}
				{cartItems.map((item) => (
					<Box
						key={item.productId}
						sx={{
							...styles.cartItem,
							py: 4,
							minHeight: 120,
						}}>
						{/* Image */}
						<Box sx={styles.productImageContainer}>
							<Box
								component="img"
								src={item.imageUrl}
								alt={item.name}
								sx={styles.productImage}
							/>
						</Box>

						{/* Name / details */}
						<Box sx={styles.productInfo}>
							<Typography variant="h6" sx={styles.productName}>
								{item.name}
							</Typography>
							<Typography variant="body2" sx={styles.productDescription}>
								{item.brand} • {item.size} • {item.category}
							</Typography>
						</Box>

						{/* Quantity */}
						<Box sx={styles.quantityControls}>
							<IconButton
								sx={styles.quantityButton}
								onClick={() => handleQuantityChange(item.productId, -1)}>
								<Remove fontSize="small" />
							</IconButton>
							<Box sx={styles.quantityDisplay}>
								<Typography>{item.quantity || 1}</Typography>
							</Box>
							<IconButton
								sx={styles.quantityButton}
								onClick={() => handleQuantityChange(item.productId, 1)}>
								<Add fontSize="small" />
							</IconButton>
						</Box>

						{/* Line total */}
						<Typography variant="h6" sx={styles.productPrice}>
							PKR {(item.price * (item.quantity || 1)).toFixed(2)}
						</Typography>

						{/* Remove button */}
						<IconButton
							sx={styles.deleteButton}
							onClick={() => handleRemove(item.productId)}>
							<Box
								component="img"
								src={deleteIcon}
								alt="Delete"
								width={20}
								height={20}
							/>
						</IconButton>
					</Box>
				))}

				{/* Summary */}
				{cartItems.length > 0 && (
					<Box sx={{ mt: 6, ...styles.summaryContainer }}>
						<Typography variant="h4" sx={styles.totalPrice}>
							PKR{" "}
							{cartTotal.toLocaleString(undefined, {
								minimumFractionDigits: 2,
							})}
						</Typography>
						<Typography variant="body2" sx={styles.taxesNote}>
							Taxes &amp; Shipping Inc.
						</Typography>
						<Button
							fullWidth
							variant="contained"
							onClick={() => navigate("/checkout")}
							sx={styles.checkoutButton}>
							Proceed to Checkout →
						</Button>
					</Box>
				)}
			</Box>
		</>
	);
}
