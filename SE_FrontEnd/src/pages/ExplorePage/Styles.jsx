
import Women from '../../assets/ExplorePage/Women.png'; // Adjust the number of '../' based on the actual folder structure


export const root = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh", // Ensures the minimum height is 100% of the viewport height
    backgroundColor: "#f0f0f0", // Light gray background
};

export const ImageBox = {
    height: 600,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // First child at the top, second at the bottom
    paddingY: 2,
    backgroundImage: `
      linear-gradient(rgba(218, 77, 77, 0.3), rgba(231, 76, 76, 0.3)),
      url(${Women})
    `,
    backgroundBlendMode: "multiply", // or "overlay"
    backgroundSize: "cover", // Ensures the image covers the entire box
    backgroundPosition: "center", // Centers the image
    backgroundRepeat: "no-repeat", // Prevents the image from repeating
};

export const HeaderBox = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginX: 8

}

export const SearchBox = {
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
}

export const ClothesBox = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingY: 4,
    width: "100%",
    backgroundColor: "#f0f0f0", // Light gray background
    gap:4,
}
  