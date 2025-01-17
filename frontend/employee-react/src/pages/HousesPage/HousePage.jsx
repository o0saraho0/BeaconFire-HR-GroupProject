import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Typography, Card, CardContent, List, ListItem, Box, Alert, CircularProgress } from "@mui/material";

const HousePage = () => {
    const userId = useSelector((state) => state.auth?.userId); // Access userId from auth slice
    const [houseDetails, setHouseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setError("You are not logged in. Please log in to view your house details.");
            setLoading(false);
            return;
        }

        const fetchHouseDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://localhost:3000/api/houses/${userId}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch house details. Please try again later.");
                }

                const data = await response.json();
                setHouseDetails(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHouseDetails();
    }, [userId]);

    if (loading) {
        return (
            <Container style={{ marginTop: "80px" }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ marginTop: "80px" }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container style={{ marginTop: "80px" }}>
            <Typography variant="h4" gutterBottom>
                House Details
            </Typography>
            {houseDetails ? (
                <Card>
                    <CardContent>
                        <Typography variant="h6">Address: {houseDetails.address}</Typography>
                        <Typography variant="h6">Roommates:</Typography>
                        <List>
                            {houseDetails.roommates.map((roommate, index) => (
                                <ListItem key={index}>
                                    {roommate.name} - {roommate.phone}
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            ) : (
                <Typography>No house details found.</Typography>
            )}
        </Container>
    );
};

export default HousePage;
