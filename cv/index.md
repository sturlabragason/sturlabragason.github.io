---
layout: page
title: CV
permalink: /cv/
---

<button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Dark Mode">● / ○</button>

<div class="cv-container">

    <div class="cv-header-quote">
        I’m Winston Wolfe. I Solve Problems
    </div>
    <span class="cv-header-author">— Winston Wolfe, Pulp Fiction</span>

    <div class="cv-intro">
        I am a methodical problem solver, no-nonsense communicator, and tactful diplomat. For the past decade I have led my colleagues consistently to success as the go-to engineer and hands-on architect.
    </div>

    <h2 class="cv-section-title">Positions</h2>

    <ul class="cv-positions">
        <li class="cv-position-item">
            <div class="cv-role-group">
                <span class="cv-role">Principal Platform & AI Engineer</span>
                <span class="cv-company">Aeven</span>
            </div>
            <span class="cv-years">2025 - Present</span>
        </li>
        <li class="cv-position-item">
            <div class="cv-role-group">
                <span class="cv-role">Principal Architect (Cloud, DevOps, & AI)</span>
                <span class="cv-company">Devoteam</span>
            </div>
            <span class="cv-years">2020 - 2025</span>
        </li>
        <li class="cv-position-item">
            <div class="cv-role-group">
                <span class="cv-role">Senior Consultant & Infrastructure Trainer</span>
                <span class="cv-company">Omada</span>
            </div>
            <span class="cv-years">2018 - 2020</span>
        </li>
        <li class="cv-position-item">
            <div class="cv-role-group">
                <span class="cv-role">Technical Consultant & Azure Specialist</span>
                <span class="cv-company">Wise</span>
            </div>
            <span class="cv-years">2017 - 2018</span>
        </li>
        <li class="cv-position-item">
            <div class="cv-role-group">
                <span class="cv-role">FullStack Developer & Site Reliability Engineer</span>
                <span class="cv-company">Staff.is</span>
            </div>
            <span class="cv-years">2016 - 2017</span>
        </li>
    </ul>

    <h2 class="cv-section-title">My approach</h2>

    <div class="cv-approach">
        <p>I am a cloud-native platform engineer. I focus on open-source best practices and vendor-neutral solutions. My approach to architecture is lean, uncluttered, and minimalist so that it is easy for the whole team to manage. I use a divide-and-conquer style to break down complex backlogs into clear, actionable tasks. Any work I do creates tangible outcomes; code, diagrams, or documentation that ensure everyone knows exactly how to move forward.</p>
    </div>

    <div class="cv-actions">
        <a href="javascript:window.print()" class="cv-btn">[ PRINT / SAVE PDF ]</a>
    </div>

</div>

<script>
    const toggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme == 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (currentTheme == 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    toggleBtn.addEventListener('click', function() {
        let theme = 'light';
        if (document.documentElement.getAttribute('data-theme') === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            theme = 'dark';
        } else if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            theme = 'light';
        } else {
            // If no attribute is set, check system preference
            if (prefersDarkScheme.matches) {
                document.documentElement.setAttribute('data-theme', 'light');
                theme = 'light';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                theme = 'dark';
            }
        }
        localStorage.setItem('theme', theme);
    });
</script>
