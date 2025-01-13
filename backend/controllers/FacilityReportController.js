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
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};