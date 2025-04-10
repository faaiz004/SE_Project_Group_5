
import Women from '../../assets/ExplorePage/Women.png'; 


export const root = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh", 
    backgroundColor: "#f0f0f0", 
};

export const ImageBox = {
    height: 600,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", 
    paddingY: 2,
    backgroundImage: `
      linear-gradient(rgba(218, 77, 77, 0.3), rgba(231, 76, 76, 0.3)),
      url(${Women})
    `,
    backgroundBlendMode: "multiply", 
    backgroundSize: "cover",
    backgroundPosition: "center", 
    backgroundRepeat: "no-repeat",
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
    backgroundColor: "#f0f0f0", 
    gap:4,
}
  