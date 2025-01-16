import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Typography, Card, CardContent, List, ListItem, Box } from "@mui/material";

const HousePage = () => {
    const userId = useSelector((state) => state.auth.userId); // Access userId from auth slice
    const [houseDetails, setHouseDetails] = useState(null);
    const [facilityReports, setFacilityReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            console.error("User ID is not available");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch house details
                const houseResponse = await fetch(`http://localhost:5000/api/houses/${userId}`);
                if (!houseResponse.ok) throw new Error("Failed to fetch house details");
                const houseData = await houseResponse.json();
                setHouseDetails(houseData);

                // Fetch facility reports
                const reportsResponse = await fetch(`http://localhost:5000/api/facility-reports/${userId}`);
                if (!reportsResponse.ok) throw new Error("Failed to fetch facility reports");
                const reportsData = await reportsResponse.json();
                setFacilityReports(reportsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, [userId]);

    if (!userId) {
        return <Typography>Please log in to view your house details.</Typography>;
    }

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                House Details
            </Typography>
            <Card>
                <CardContent>
                    {houseDetails ? (
                        <>
                            <Typography variant="h6">Address: {houseDetails.address}</Typography>
                            <Typography variant="h6">Roommates:</Typography>
                            <List>
                                {houseDetails.roommates.map((roommate, index) => (
                                    <ListItem key={index}>
                                        {roommate.name} - {roommate.phone}
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    ) : (
                        <Typography>No house details found.</Typography>
                    )}
                </CardContent>
            </Card>

            <Box mt={4}>
                <Typography variant="h5">Facility Reports</Typography>
                {facilityReports.length > 0 ? (
                    <List>
                        {facilityReports.map((report) => (
                            <ListItem key={report.id}>
                                <Box>
                                    <Typography variant="body1">{report.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {report.description}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Status: {report.status}
                                    </Typography>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No reports found.</Typography>
                )}
            </Box>
        </Container>
    );
};

export default HousePage;
