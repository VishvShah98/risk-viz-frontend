import { Box, Typography } from "@mui/material";
import Image from "next/image";
import state from "../state";
import { useSnapshot } from "valtio";
import { useEffect, useState } from "react";

export default function LandingPage() {

    const snapshot = useSnapshot(state);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (state.graphData.length > 0)
            setLoading(false);
    }, [snapshot.graphData]);
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
                    filter: "brightness(0.5)",
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
                    color: "white",
                    backgroundColor: loading ? "darkgreen" : "green",
                    padding: "10px 20px",
                    fontSize: "15px",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
                    transition: "all 0.3s ease",
                }}

                onClick={() => {
                    const element = document.getElementById("main-content");
                    if (element instanceof HTMLElement) {
                        element.scrollIntoView({ behavior: "smooth" });
                    }
                }}

            >
                {/* Check if data has loaded*/}
                {loading ? "Loading Data..." : "Explore Data"}
            </button>

        </Box>
    );
}
