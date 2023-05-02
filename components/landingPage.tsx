import { Box, Typography } from "@mui/material";
import Image from "next/image";
import state from "../state";
import { useSnapshot } from "valtio";

export default function LandingPage() {

    const snapshot = useSnapshot(state);

    return (
        <Box
            sx={{
                height: "100vh",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                filter: "brightness(1.5)",
            }}
        >
            <Image
                alt="background image"
                src="/land.jpeg"
                width={1000}
                height={1000}
                style={{
                    filter: "brightness(0.6)",
                    position: "fixed",
                    zIndex: -1,
                    height: "100vh",
                    width: "100vw",
                }}
            />


            <Typography
                variant="h1"
                sx={{ mb: 4, px: { xs: 4, md: 10 }, fontWeight: 450 }}
            >
                Risk Wizard
            </Typography>
            <Typography
                variant="h6"
                sx={{ mb: 4, px: { xs: 2, md: 30 }, color: "grey" }}
            >
                Explore climate risk factors with our interactive web app. Visualize risk levels through maps, tables, and graphs. Get valuable insights and make informed decisions.
            </Typography>
            <button
                style={{
                    borderRadius: "20px",
                    color: "black",
                    backgroundColor: "white",
                    padding: "10px 20px 10px 20px",
                    fontSize: "15px",
                }}

                onClick={() => {
                    const element = document.getElementById("main-content");
                    if (element instanceof HTMLElement) {
                        element.scrollIntoView({ behavior: "smooth" });
                    }
                }}

            >
                {/* Check if data has loaded*/}
                {snapshot.graphData.length > 0 ? "Explore Data" : "Loading Data..."}
            </button>
        </Box>
    );
}
