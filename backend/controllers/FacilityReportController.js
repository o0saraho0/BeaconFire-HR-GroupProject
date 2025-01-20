import FacilityReport from '../models/FacilityReport.js';

export const createFacilityReport = async (req, res) => {
    try {
        const report = new FacilityReport(req.body);
        await report.save();
        res.status(201).json({ message: 'Facility report created', report });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getReportsByHouse = async (req, res) => {
    try {
        const reports = await FacilityReport.find({ house_id: req.params.houseId });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateReportStatus = async (req, res) => {
    try {
        const report = await FacilityReport.findByIdAndUpdate(
            req.params.reportId,
            { status: req.body.status },

        );
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Comment functionality
export const addComment = async (req, res) => {
    try {
        const report = await FacilityReport.findById(req.params.reportId);

        if (!report) return res.status(404).json({ error: 'Report not found' });

        if (!report.status) {
            report.status = "Open"; // Default to a valid enum value if not already set
        }

        report.comments.push({
            description: req.body.description,
            posted_by: req.body.posted_by,
            updated_at: Date.now(),
        });

        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const report = await FacilityReport.findOneAndUpdate(
            { _id: req.params.reportId, 'comments._id': req.params.commentId },
            { $set: { 'comments.$.description': req.body.description, 'comments.$.updated_at': Date.now() } },
            { new: true }
        );

        if (!report) return res.status(404).json({ error: 'Comment not found' });
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getComments = async (req, res) => {
    try {
        const report = await FacilityReport.findById(req.params.reportId);

        if (!report) return res.status(404).json({ error: 'Report not found' });

        res.status(200).json(report.comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};