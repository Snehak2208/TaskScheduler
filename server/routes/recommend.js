const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

// Auth middleware (copy from your task route)




function auth(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, auth denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

// Util: suggest technique by task duration
function suggestTechnique(minutes) {
    if (minutes <= 30) return "Pomodoro";
    if (minutes <= 60) return "52-17";
    if (minutes > 60 && minutes <= 180) return "7-8-9";
    return "Deep Work";
}

// Main endpoint
router.get('/', auth, async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date required' });

    try {
        const tasks = await Task.find({ user: req.user, date });
        // Separate fixed jobs and normal tasks
        const fixedJobs = tasks.filter(t => t.isFixed);
        const normalTasks = tasks.filter(t => !t.isFixed);

        // Make time slots based on fixed jobs
        let slots = [];
        // Example: day from 06:00 to 23:00
        let dayStart = 6 * 60, dayEnd = 23 * 60; // minutes from midnight
        let lastEnd = dayStart;

        // Sort fixed jobs by start time
        fixedJobs.sort((a, b) => a.fixedStart.localeCompare(b.fixedStart));
        fixedJobs.forEach(job => {
            let jobStart = parseInt(job.fixedStart.split(':')[0]) * 60 + parseInt(job.fixedStart.split(':')[1]);
            if (lastEnd < jobStart) {
                slots.push({ start: lastEnd, end: jobStart });
            }
            lastEnd = parseInt(job.fixedEnd.split(':')[0]) * 60 + parseInt(job.fixedEnd.split(':')[1]);
        });
        if (lastEnd < dayEnd) slots.push({ start: lastEnd, end: dayEnd });

        // Assign tasks to slots
        let schedule = [];
        let taskIdx = 0;
        slots.forEach(slot => {
            let slotDuration = slot.end - slot.start;
            let curTime = slot.start;
            while (slotDuration > 0 && taskIdx < normalTasks.length) {
                let task = normalTasks[taskIdx];
                let duration = Math.min(task.estimatedTime, slotDuration);
                schedule.push({
                    title: task.title,
                    category: task.category,
                    start: `${String(Math.floor(curTime / 60)).padStart(2, '0')}:${String(curTime % 60).padStart(2, '0')}`,
                    end: `${String(Math.floor((curTime + duration) / 60)).padStart(2, '0')}:${String((curTime + duration) % 60).padStart(2, '0')}`,
                    technique: suggestTechnique(duration)
                });
                curTime += duration;
                slotDuration -= duration;
                // If task not fully scheduled, reduce its estimatedTime and keep in list
                if (task.estimatedTime > duration) {
                    task.estimatedTime -= duration;
                } else {
                    taskIdx++;
                }
            }
        });

        // Add the fixed jobs into schedule as well
        fixedJobs.forEach(job => {
            schedule.push({
                title: job.title,
                category: job.category,
                start: job.fixedStart,
                end: job.fixedEnd,
                technique: "Routine"
            });
        });

        // Sort by start time
        schedule.sort((a, b) => a.start.localeCompare(b.start));

        res.json({ schedule });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
