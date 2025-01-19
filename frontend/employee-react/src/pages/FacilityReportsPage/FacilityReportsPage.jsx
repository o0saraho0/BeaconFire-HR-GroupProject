import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Use useParams for route params
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Paper,
    Button,
} from "@mui/material";
import axios from "../../interceptors/auth.interceptor";

const FacilityReportsPage = () => {
    const { houseId } = useParams(); // Extract houseId from route
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                console.log(`Fetching reports for houseId: ${houseId}`); // Debugging
                const response = await axios.get(`http://localhost:3000/api/reports/${houseId}`);
                setReports(response.data); // Adjust based on actual response structure
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to fetch facility reports.");
            } finally {
                setLoading(false);
            }
        };

        if (houseId) {
            fetchReports();
        } else {
            setError("Invalid house ID.");
        }
    }, [houseId]);

    if (loading) {
        return (
            <Container style={{ marginTop: "80px" }}>
                <CircularProgress />
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
                Facility Reports for House ID: {houseId}
            </Typography>
            {reports.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Report Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>{report.reportName}</TableCell>
                                    <TableCell>{report.description}</TableCell>
                                    <TableCell>{report.status}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary">
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="secondary" style={{ marginLeft: "8px" }}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>No facility reports found for this house.</Typography>
            )}
        </Container>
    );
};

export default FacilityReportsPage;
