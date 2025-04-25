import React, { useState } from "react";
import {
	Box,
	InputBase,
	IconButton,
	Paper,
	CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function SearchBar() {
	const [query, setQuery] = useState("");
	const [focused, setFocused] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSearch = async () => {
		if (!query.trim()) return;

		setLoading(true);
		try {
			const res = await fetch("https://api.openai.com/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${OPENAI_API_KEY}`,
				},
				body: JSON.stringify({
					model: "gpt-4o",
					messages: [
						{
							role: "system",
							content: `
              You are a clothes‐query parser. Below is the Mongoose schema for our “clothes” collection: const clothesSchema = new mongoose.Schema({ name: String, brand: String, size: { type: String, enum: ['XS','S','M','L','XL','XXL'] }, category: { type: String, enum: ['Modern','Modern/Old_Money','Smart_Casual/Casual_Everyday','Smart_Casual','Casual_Everyday'] }, price: Number, upper: Boolean, lower: Boolean, imageUrl: String }); When I give you a user’s free‐text request, output exactly three comma-separated tokens with no extra text or line breaks in the form <Category>,<min>-<max>,<upper|lower|both>.`,
						},
						{
							role: "user",
							content: query,
						},
					],
					max_tokens: 16,
					temperature: 0.2,
				}),
			});

			const data = await res.json();
			const text = data.choices?.[0]?.message?.content?.trim();
			if (!text) return;

			const [category, priceRange, part] = text.split(",");
			const params = new URLSearchParams({
				category,
				price: priceRange,
				part,
			});

			navigate(`/all-clothes-search?${params.toString()}`);
			setFocused(false);
		} catch (err) {
			console.error("Error during search:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
			<Paper
				component="form"
				sx={{
					p: "2px 8px",
					display: "flex",
					alignItems: "center",
					width: 400,
					borderRadius: 2,
					boxShadow: focused ? 3 : 1,
				}}
				onSubmit={(e) => {
					e.preventDefault();
					handleSearch();
				}}>
				<InputBase
					sx={{ ml: 1, flex: 1 }}
					placeholder="Search for clothes..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleSearch();
					}}
				/>
				<IconButton onClick={handleSearch} disabled={loading}>
					{loading ? <CircularProgress size={20} /> : <SearchIcon />}
				</IconButton>
			</Paper>
		</Box>
	);
}
