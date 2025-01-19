import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    Box,
    Alert,
    CircularProgress,
} from "@mui/material";
import axios from "../../interceptors/auth.interceptor";

const HousePage = () => {
    const token = useSelector((state) => state.auth.token); // Retrieve token from auth slice
    const navigate = useNavigate();
    const [houseDetails, setHouseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            setError("You are not logged in. Please log in to view your house details.");
            setLoading(false);
            return;
        }

        const fetchHouseDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3000/api/houses/by-user");
                setHouseDetails(response.data.house);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError("Unauthorized. Please log in again.");
                } else {
                    setError(err.response?.data?.message || "Failed to fetch house details.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHouseDetails();
    }, []);

    if (loading) {
        return (
            <Container style={{ marginTop: "10vh" }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ marginTop: "10vh" }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container style={{ marginTop: "10vh" }}>
            <Typography variant="h4" gutterBottom>
                House Details
            </Typography>
            {houseDetails ? (
                <Card>
                    <CardContent>
                        <Typography variant="h6">Address:</Typography>
                        <Typography>{`${houseDetails.address.building}, ${houseDetails.address.street}, ${houseDetails.address.city}, ${houseDetails.address.state}, ${houseDetails.address.zip}`}</Typography>

                        <Typography variant="h6" style={{ marginTop: "16px" }}>
                            Landlord:
                        </Typography>
                        <Typography>{`${houseDetails.landlord.first_name} ${houseDetails.landlord.last_name}`}</Typography>
                        <Typography>{`Phone: ${houseDetails.landlord.phone_number}`}</Typography>
                        <Typography>{`Email: ${houseDetails.landlord.email}`}</Typography>

                        <Typography variant="h6" style={{ marginTop: "16px" }}>
                            Facility Information:
                        </Typography>
                        <Typography>{`Beds: ${houseDetails.beds}`}</Typography>
                        <Typography>{`Mattresses: ${houseDetails.mattresses}`}</Typography>
                        <Typography>{`Tables: ${houseDetails.tables}`}</Typography>
                        <Typography>{`Chairs: ${houseDetails.chairs}`}</Typography>

                        <Typography variant="h6" style={{ marginTop: "16px" }}>
                            Tenants:
                        </Typography>
                        <List>
                            {houseDetails.tenants.length > 0 ? (
                                houseDetails.tenants.map((tenant, index) => (
                                    <ListItem key={index}>
                                        <Typography>
                                            {tenant.preferred_name || `${tenant.first_name} ${tenant.last_name}`} - {tenant.cell_phone}
                                        </Typography>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No tenants assigned.</Typography>
                            )}
                        </List>

                        <Box style={{ marginTop: "16px" }}>
                            <button
                                style={{
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    padding: "8px 16px",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    console.log(`Navigating to /facility-reports/${houseDetails._id}`);
                                    navigate(`/facility-reports/${houseDetails._id}`);
                                }}
                            >
                                View Reports
                            </button>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Typography>No house details found.</Typography>
            )}
        </Container>
    );
};

export default HousePage;
