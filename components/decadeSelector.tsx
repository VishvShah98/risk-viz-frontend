import { useEffect, useState } from "react";
import { getDecades, getDataByDecade } from "../src/pages/api";
import { Decade } from "./types";

// Create a component to select a decade
function DecadeSelector() {

  // Declare the state variables for the selected decade and the list of available decades
  const [decades, setDecades] = useState<Decade[]>([]);
  const [selectedDecade, setSelectedDecade] = useState<number>(0);

  // Fetch the list of available decades on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDecades();

        // Map the response data to the shape of the Decade object
        const mappedData = data.map((decade, index) => ({
          _id: `${index}`,
          Decade: decade,
        }));

        // Set the list of available decades and the initial selected decade state
        setDecades(mappedData);
        setSelectedDecade(mappedData[0].Decade);

      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Handle the decade selection change event
  const handleSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = parseInt(event.target.value);

    // Update the selected decade state and retrieve updated data
    setSelectedDecade(selected);
    try {
      await getDataByDecade(selected);
    } catch (error) {
      console.log(error);
    }
  };

  // Render the decade selection component
  return (
    <div className="text-black" style={{zIndex:3}}>
      <label htmlFor="decade" style={{color:'white', marginRight:10}}>
        Select a decade:
      </label>
      <select
        id="decade"
        className="text-black"
        value={selectedDecade}
        onChange={handleSelect}
      >
        {/* Map the available decades to option elements */}
        {decades.map((decade, index) => {
          const startDecade = decade.Decade;
          const endDecade = startDecade + 10;
          const decadeRange = `${startDecade} - ${endDecade}`;
          return (
            <option key={decade._id} value={decade.Decade} className="text-black">
              {decadeRange}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default DecadeSelector;
