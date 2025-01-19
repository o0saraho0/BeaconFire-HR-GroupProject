import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
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
    Modal,
    TextField,
} from "@mui/material";
import axios from "../../interceptors/auth.interceptor";

const FacilityReportsPage = () => {
    const { houseId } = useParams(); // Extract houseId from the route
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [viewCommentsModalOpen, setViewCommentsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const userId = useSelector((state) => state.auth.userId);

    // Fetch reports for the house
    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/reports/${houseId}`);
            setReports(response.data); // Assume response.data is an array of reports
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to fetch facility reports.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [houseId]);

    // Add a new report
    const addReport = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/api/reports`, {
                title: newReport.title,
                description: newReport.description,
                house_id: houseId, // Backend expects `house_id`
                status: "Open", // Default status
                created_by: userId,
            });
            setReports((prevReports) => [...prevReports, response.data.report]); // Use `response.data.report`
            setAddModalOpen(false); // Close modal after success
            setNewReport({ title: "", description: "" }); // Reset form
        } catch (err) {
            console.error("Failed to add a new report:", err);
            alert(err.response?.data?.message || "Failed to add the report.");
        }
    };

    // Add a comment to a report
    const addComment = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3000/api/reports/${selectedReport._id}/comments`,
                {
                    description: newComment,
                    posted_by: "employee", // Use the authenticated user's ID
                }
            );
            setComments((prevComments) => [...prevComments, response.data]); // Append the new comment
            setCommentModalOpen(false); // Close the modal
            setNewComment(""); // Reset the input field
        } catch (err) {
            console.error("Failed to add a comment:", err);
            alert(err.response?.data?.message || "Failed to add the comment.");
        }
    };

    // Fetch comments for a report
    const fetchComments = async (reportId) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/reports/${reportId}/comments`
            );
            setComments(response.data); // Store fetched comments
            setViewCommentsModalOpen(true); // Open the modal to view comments
        } catch (err) {
            console.error("Failed to fetch comments:", err);
            alert(err.response?.data?.message || "Failed to fetch comments.");
        }
    };

    if (loading) {
        return (
            <Container style={{ marginTop: "10vh" }}>
                <CircularProgress />
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
                Facility Reports
            </Typography>

            {reports.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Comments</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report._id}>
                                    <TableCell>{report.title}</TableCell>
                                    <TableCell>{report.description}</TableCell>
                                    <TableCell>{report.status}</TableCell>
                                    <TableCell>{report.created_by || "N/A"}</TableCell>
                                    <TableCell>
                                        {new Date(report.created_at).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                setSelectedReport(report);
                                                setCommentModalOpen(true);
                                            }}
                                            style={{ marginRight: "8px" }}
                                        >
                                            Add Comment
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => fetchComments(report._id)}
                                        >
                                            View Comments
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

            {/* Add Comment Modal */}
            <Modal open={commentModalOpen} onClose={() => setCommentModalOpen(false)}>
                <Paper style={{ margin: "20vh auto", padding: "20px", width: "400px" }}>
                    <Typography variant="h6">Add Comment</Typography>
                    <TextField
                        label="Comment"
                        fullWidth
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{ marginTop: "2vh" }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addComment}
                        style={{ marginTop: "2vh" }}
                    >
                        Submit
                    </Button>
                </Paper>
            </Modal>

            {/* View Comments Modal */}
            <Modal open={viewCommentsModalOpen} onClose={() => setViewCommentsModalOpen(false)}>
                <Paper style={{ margin: "20vh auto", padding: "20px", width: "400px" }}>
                    <Typography variant="h6">Comments</Typography>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <Typography
                                key={index}
                                variant="body1"
                                style={{ marginTop: "2vh", paddingBottom: "1vh" }}
                            >
                                <strong>By:</strong> {comment.posted_by || "N/A"} <br />
                                <strong>At:</strong>{" "}
                                {new Date(comment.updated_at || Date.now()).toLocaleString()} <br />
                                <strong>Comment:</strong> {comment.description}
                            </Typography>
                        ))
                    ) : (
                        <Typography>No comments yet.</Typography>
                    )}
                </Paper>
            </Modal>
        </Container>
    );
};

export default FacilityReportsPage;
