import img1 from "../../assets/ExplorePage/testimage1.png";
import img2 from "../../assets/ExplorePage/testimage2.png";
import img3 from "../../assets/ExplorePage/testimage3.png";
import img4 from "../../assets/ExplorePage/testimage4.png";

const outfitsData = [
  { id: 1, category: "Formal", imageUrl: img1 },
  { id: 2, category: "Formal", imageUrl: img2 },
  { id: 3, category: "Formal", imageUrl: img3 },
  { id: 4, category: "Formal", imageUrl: img4 },
  {id: 10, category: "Formal", imageUrl: img1 },
  { id: 5, category: "Vintage", imageUrl: img1 },
  { id: 6, category: "Vintage", imageUrl: img2 },
  { id: 7, category: "Vintage", imageUrl: img3 },
  { id: 8, category: "Vintage", imageUrl: img4 },
  { id: 9, category: "Vintage", imageUrl: img1 },
];

export async function fetchOutfits() {
  try {
    const response = await fetch('http://localhost:8000/api/clothes/getClothes'); // adjust the URL if needed
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching outfits:", error);
    throw error;
  }
}


