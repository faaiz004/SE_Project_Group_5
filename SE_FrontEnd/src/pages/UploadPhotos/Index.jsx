import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  IconButton,
  InputBase,
  Backdrop,
  CircularProgress
} from "@mui/material";
import {
  CloudUpload,
  Search,
  Favorite,
  ChatBubbleOutline,
  FilterList
} from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import { getPurchases } from "../../api/clothesService";
import { createPost } from "../../api/postService";
import Navbar from "../../Layouts/StyleFeed/Navbar";

export default function CreatePostForm() {
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", sev: "success" });
  const [loading, setLoading] = useState(false);

  const { data, isLoading: purchasesLoading, error: purchasesError } = useQuery({
    queryKey: ["purchasedClothes"],
    queryFn: getPurchases
  });
  const pastPurchases = data?.clothes || [];

  const qc = useQueryClient();

  const isUpper = (item) => item.upper;
  const isLower = (item) => item.lower;

  const postMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setLoading(false);
      setCaption("");
      setSelectedImageFile(null);
      setSelectedImagePreview(null);
      setSelectedItems([]);
      qc.invalidateQueries(["posts"]);
      setSnackbar({ open: true, msg: "Post created successfully!", sev: "success" });
    },
    onError: () => {
      setLoading(false);
      setSnackbar({ open: true, msg: "Failed to create post. Please try again.", sev: "error" });
    }
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setSelectedImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleItemSelection = (id) => {
    const item = pastPurchases.find((p) => p._id === id);
    if (!item) return;

    if (selectedItems.includes(id)) {
      setSelectedItems((prev) => prev.filter((x) => x !== id));
      return;
    }

    const upperSel = selectedItems.find((sid) =>
      isUpper(pastPurchases.find((p) => p._id === sid))
    );
    const lowerSel = selectedItems.find((sid) =>
      isLower(pastPurchases.find((p) => p._id === sid))
    );

    if (isUpper(item) && upperSel) {
      setSnackbar({ open: true, msg: "Only one upper can be tagged.", sev: "warning" });
      return;
    }
    if (isLower(item) && lowerSel) {
      setSnackbar({ open: true, msg: "Only one lower can be tagged.", sev: "warning" });
      return;
    }
    if (selectedItems.length >= 2) {
      setSnackbar({ open: true, msg: "Tag at most one upper and one lower.", sev: "warning" });
      return;
    }

    setSelectedItems((prev) => [...prev, id]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedImageFile || !caption.trim()) {
      setSnackbar({ open: true, msg: "Image and caption are required.", sev: "warning" });
      return;
    }
    setLoading(true);
    postMutation.mutate({ image: selectedImageFile, caption, clothes: selectedItems });
  };

  const filtered = pastPurchases.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedDetails = pastPurchases.filter((p) => selectedItems.includes(p._id));

  return (
    <>
      <Navbar />

      {/* Full-page loader */}
      <Backdrop
        open={loading}
        sx={(theme) => ({
          position: 'fixed',
          inset: 0,
          zIndex: theme.zIndex.modal + 10,
          bgcolor: 'rgba(0,0,0,0.5)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <CircularProgress color="inherit" size={60} />
      </Backdrop>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ py: 4, px: 2, background: "#f8f8f8", minHeight: "100vh" }}
      >
        <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "nowrap" }}>

          {/* Left (Form) */}
          <Paper sx={{ p: 4, width: 500, borderRadius: 2, flexShrink: 0 }}>
            <Typography variant="h4" align="center" fontWeight={500} mb={4}>
              Create a New Post
            </Typography>

            {/* Image Picker */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <Box
                component="label"
                htmlFor="img-pick"
                sx={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  "&:hover": { background: "#f5f5f5" }
                }}
              >
                {selectedImagePreview ? (
                  <Box
                    component="img"
                    src={selectedImagePreview}
                    alt="preview"
                    sx={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <CloudUpload sx={{ fontSize: 28, mb: 1, color: "#666" }} />
                    <Typography variant="body2" color="text.secondary">Upload image</Typography>
                  </>
                )}
                <input id="img-pick" type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </Box>
            </Box>

            {/* Caption */}
            <Typography variant="h6" gutterBottom>Caption</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              sx={{ mb: 4, "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
            />

            {/* Tag Section */}
            <Typography variant="h6" gutterBottom>Tag Worn Articles</Typography>
            <InputBase
              fullWidth
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2, p: 1, pl: 4, border: "1px solid #ddd", borderRadius: 1 }}
              startAdornment={<Search sx={{ mr: 1, color: "#666" }} />}
            />

            {purchasesLoading ? (
              <Typography>Loading purchases…</Typography>
            ) : purchasesError ? (
              <Typography color="error">Error loading purchases.</Typography>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {filtered.map((item) => (
                  <Box
                    key={item._id}
                    sx={{ width: 100, cursor: "pointer" }}
                    onClick={() => toggleItemSelection(item._id)}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 100,
                        mb: 1,
                        border: "1px solid #ddd",
                        borderRadius: 1,
                        overflow: "hidden"
                      }}
                    >
                      <Box
                        component="img"
                        src={item.signedImageUrl}
                        alt={item.name}
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {selectedItems.includes(item._id) && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: 24,
                            height: 24,
                            background: "#1976d2",
                            borderRadius: "0 0 0 6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <CheckIcon sx={{ color: "#fff", fontSize: 16 }} />
                        </Box>
                      )}
                    </Box>
                    <Typography variant="body2" noWrap>{item.name}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          {/* Right (Preview) */}
          <Paper sx={{ p: 4, width: 500, borderRadius: 2, flexShrink: 0 }}>
            <Typography variant="h4" align="center" fontWeight={500} mb={2}>
              Post Preview
            </Typography>
            <Paper elevation={1} sx={{ border: "1px solid #eee", borderRadius: 2, overflow: "hidden" }}>
              <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                <Avatar sx={{ width: 40, height: 40, mr: 1.5, bgcolor: "#eee" }} />
                <Box>
                  <Typography variant="subtitle1">username</Typography>
                  <Typography variant="body2" color="text.secondary">Just now</Typography>
                </Box>
              </Box>
              <Box
                component="img"
                src={selectedImagePreview || "https://placehold.co/600x400"}
                alt="preview"
                sx={{ width: "100%", height: "auto" }}
              />
              <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                <IconButton><Favorite sx={{ fontSize: 28 }} /></IconButton>
                <IconButton><ChatBubbleOutline sx={{ fontSize: 28 }} /></IconButton>
                <IconButton><FilterList sx={{ fontSize: 28 }} /></IconButton>
              </Box>
              <Box sx={{ px: 2, pb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">Your caption</Typography>
                <Typography variant="body2" color="text.secondary">
                  {caption || "…"}
                </Typography>
              </Box>
              <Box sx={{ px: 2, pb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedDetails.map((i) => (
                  <Chip key={i._id} label={i.name} variant="outlined" size="small" />
                ))}
              </Box>
            </Paper>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 4, py: 1.5, background: "#1a2027", "&:hover": { background: "#2c3540" } }}
              disabled={
                loading ||
                !selectedImageFile ||
                !caption.trim() ||
                selectedItems.length === 0
              }
            >
              {loading ? "Creating…" : "Create Post"}
            </Button>
          </Paper>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.sev}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
