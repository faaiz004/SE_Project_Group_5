import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
	Box,
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	Avatar,
	Typography,
	IconButton,
	Button,
	Tooltip,
	Stack,
	Snackbar,
	Alert,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getPosts, likePost, unlikePost } from "../../api/postService";

const fixUrl = (u = "") => u.replace("/thumbnails/thumbnails/", "/thumbnails/");

export default function Posts() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["posts"],
		queryFn: getPosts,
	});
	const posts = data?.posts || [];

	const [liked, setLiked] = useState({});
	const [snackbar, setSnackbar] = useState({
		open: false,
		msg: "",
		severity: "info",
	});

	useEffect(() => {
		const m = {};
		posts.forEach((p) => (m[p._id] = p.likedByCurrentUser));
		setLiked(m);
	}, [posts]);

	const likeMutation = useMutation({
		mutationFn: ({ postId, action }) =>
			action === "like" ? likePost(postId) : unlikePost(postId),
		onError: (_, { postId, prevState }) => {
			setLiked((prev) => ({ ...prev, [postId]: prevState }));
			setSnackbar({
				open: true,
				msg: "Action failed. Please try again.",
				severity: "error",
			});
		},
	});

	const handleToggleLike = (postId) => {
		const currentState = liked[postId];
		const action = currentState ? "unlike" : "like";

		setLiked((prev) => ({ ...prev, [postId]: !currentState }));

		likeMutation.mutate({ postId, action, prevState: currentState });
	};

	const handleAddToCart = (post) => {
		const existing = JSON.parse(sessionStorage.getItem("cart")) || [];
		const idsInCart = existing.map((i) => i.productId);

		let upperStatus = "";
		let lowerStatus = "";

		(post.clothes || []).forEach((c) => {
			const alreadyInCart = idsInCart.includes(c._id);
			if (c.upper) {
				upperStatus = alreadyInCart ? "Upper already in cart" : "Upper added";
			} else if (c.lower) {
				lowerStatus = alreadyInCart ? "Lower already in cart" : "Lower added";
			}

			if (!alreadyInCart) {
				existing.push({
					productId: c._id,
					name: c.name,
					brand: c.brand,
					price: c.price,
					imageUrl: fixUrl(c.imageUrl),
					quantity: 1,
				});
			}
		});

		sessionStorage.setItem("cart", JSON.stringify(existing));

		const messages = [upperStatus, lowerStatus].filter(Boolean).join(", ");
		setSnackbar({
			open: true,
			msg: messages || "No items to add",
			severity: "success",
		});
	};

	if (isLoading) return <Typography>Loading posts…</Typography>;
	if (error)
		return <Typography color="error">Error: {error.message}</Typography>;

	return (
		<>
			<Box
				sx={{
					maxWidth: 500,
					height: "calc(100vh - 120px)",
					overflowY: "auto",
					px: 2,
					"&::-webkit-scrollbar": { display: "none" },
					scrollbarWidth: "none",
				}}>
				{posts.map((p) => {
					const isLiked = liked[p._id];
					const likeCnt =
						p.likes +
						(isLiked && !p.likedByCurrentUser ? 1 : 0) -
						(!isLiked && p.likedByCurrentUser ? 1 : 0);
					const email = p.user?.email || "";
					const author = email.split("@")[0] || email;
					const priceSum = (p.clothes || []).reduce(
						(t, c) => t + (c.price || 0),
						0
					);

					return (
						<Card key={p._id} sx={{ mb: 3, borderRadius: 5, boxShadow: 2 }}>
							<CardHeader
								avatar={<Avatar alt={author} />}
								title={<Typography fontWeight={600}>{author}</Typography>}
							/>

							<CardMedia
								component="img"
								image={fixUrl(p.signedImageUrl)}
								alt={p.caption}
								sx={{ height: 450, objectFit: "cover" }}
							/>

							<CardContent
								sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
								<Typography>
									<strong>Caption:&nbsp;</strong>
									{p.caption}
								</Typography>

								{p.clothes?.length > 0 && (
									<Stack direction="row" spacing={1}>
										{p.clothes.map((c) => (
											<Tooltip key={c._id} title={`${c.name} — $${c.price}`}>
												<Box
													component="img"
													src={fixUrl(c.imageUrl)}
													alt={c.name}
													sx={{
														width: 48,
														height: 48,
														borderRadius: 1,
														objectFit: "cover",
														border: "1px solid #ddd",
													}}
												/>
											</Tooltip>
										))}
									</Stack>
								)}

								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}>
									<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
										<IconButton onClick={() => handleToggleLike(p._id)}>
											{isLiked ? (
												<FavoriteIcon color="error" />
											) : (
												<FavoriteBorderIcon />
											)}
										</IconButton>
										<Typography fontWeight={600}>{likeCnt} Likes</Typography>
									</Box>
									<Typography fontWeight="bold" fontSize={24}>
										${priceSum.toFixed(2)}
									</Typography>
								</Box>

								<Button
									variant="contained"
									onClick={() => handleAddToCart(p)}
									sx={{
										mt: 1,
										background: "black",
										"&:hover": { background: "#333" },
										borderRadius: 2,
										textTransform: "none",
									}}>
									Add to Cart
								</Button>
							</CardContent>
						</Card>
					);
				})}
			</Box>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
				<Alert
					onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
					severity={snackbar.severity}
					sx={{ width: "100%" }}>
					{snackbar.msg}
				</Alert>
			</Snackbar>
		</>
	);
}
