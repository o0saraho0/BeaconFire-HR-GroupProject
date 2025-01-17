import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeProfile } from "../../store/employeeSlice/employee.slice";
import { Container, Typography, Card, CardContent, List, ListItem, Box } from "@mui/material";

const HousePage = () => {
    const dispatch = useDispatch();

    const profile = useSelector((state) => state.employee.profile);
    const userId = profile?.user_id; // Extract userId from employee profile
    const status = useSelector((state) => state.employee.status);

    const [houseDetails, setHouseDetails] = useState(null);
    const [facilityReports, setFacilityReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchEmployeeProfile());
    }, [dispatch]);

    useEffect(() => {
        const fetchHouseData = async () => {
            if (!userId) {
                console.log("No userId available");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Authorization token is missing");
                }

                // Fetch house details
                const houseResponse = await fetch(`http://localhost:3000/api/houses/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!houseResponse.ok) {
                    throw new Error(`Failed to fetch house details: ${houseResponse.status} ${houseResponse.statusText}`);
                }
                const houseData = await houseResponse.json();
                setHouseDetails(houseData);

                // Fetch facility reports
                const reportsResponse = await fetch(`http://localhost:3000/api/facility-reports/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!reportsResponse.ok) {
                    throw new Error(`Failed to fetch facility reports: ${reportsResponse.status} ${reportsResponse.statusText}`);
                }
                const reportsData = await reportsResponse.json();
                setFacilityReports(reportsData);
            } catch (error) {
                console.error("Error fetching house or reports data:", error);
                alert("Failed to fetch house or facility reports. Please ensure you're logged in.");
            }
            setLoading(false);
        };

        if (userId) {
            fetchHouseData();
        }
    }, [userId]);

    if (status === "loading" || loading) {
        return (
            <Container style={{ marginTop: "80px" }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (!houseDetails) {
        return (
            <Container style={{ marginTop: "80px" }}>
                <Typography>No house details found. Please contact support.</Typography>
            </Container>
        );
    }

    return (
        <Container style={{ marginTop: "80px" }}>
            <Typography variant="h4" gutterBottom>
                House Details
            </Typography>
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
                    <Typography>No facility reports found. You can create one if needed.</Typography>
                )}
            </Box>
        </Container>
    );
};

export default HousePage;
