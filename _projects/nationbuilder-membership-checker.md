---
layout: page
title: NationBuilder Membership Checker
---

<section class="section">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-8">
        <div class="content">
          <!-- Project Header -->
          <div class="project-header mb-5">
            <div class="row align-items-center">
              <div class="col-md-8">
                <div class="project-links mb-3 mb-md-0">
                  <a href="https://bikeeasy.org/check-your-membership/" target="_blank" class="btn btn-primary mr-3 mb-2">
                    <i class="ti-world"></i> Live Project
                  </a>
                  <a href="https://github.com/adamdavies1915/nation-builder-membership" target="_blank" class="btn btn-outline-primary mb-2">
                    <i class="ti-github"></i> View Code
                  </a>
                </div>
              </div>
              <div class="col-md-4 text-md-right">
                <div class="project-meta-compact">
                  <small class="text-muted d-block">Client</small>
                  <strong>Bike Easy</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Project Image -->
          <div class="project-image mb-5">
            <img src="{{ '/assets/images/portfolio/nationbuilder-membership-checker.png' | relative_url }}" alt="NationBuilder Membership Checker" class="img-fluid rounded shadow-lg">
          </div>
          
          <!-- Project Overview -->
          <div class="project-section mb-4">
            <h2 class="h3 mb-3">Project Overview</h2>
            <p class="lead">A custom membership verification tool built for Bike Easy, a New Orleans-based non-profit organization focused on bicycle advocacy and education. This application integrates with NationBuilder's API to provide real-time membership status checking for their community members.</p>
            
            <h3 class="h4 mb-3 mt-4">The Challenge</h3>
            <p>Bike Easy needed a streamlined solution to quickly verify member status using email addresses. This served dual purposes: allowing members to self-check their membership status and enabling staff to efficiently verify memberships at events without navigating the complex NationBuilder interface. Surprisingly, NationBuilder lacked this basic functionality despite offering a comprehensive API.</p>
          </div>
          
          <div class="row">
            <div class="col-lg-8">
              <!-- Key Features -->
              <div class="project-section mb-4">
                <h3 class="h4 mb-3">Key Features</h3>
                <div class="row">
                  <div class="col-sm-6 mb-3">
                    <div class="feature-item">
                      <h5 class="h6 mb-2">Real-time Verification</h5>
                      <p class="small text-muted mb-0">Instant membership status lookup through NationBuilder API integration</p>
                    </div>
                  </div>
                  <div class="col-sm-6 mb-3">
                    <div class="feature-item">
                      <h5 class="h6 mb-2">User-friendly Interface</h5>
                      <p class="small text-muted mb-0">Clean, responsive design that works across all devices</p>
                    </div>
                  </div>
                  <div class="col-sm-6 mb-3">
                    <div class="feature-item">
                      <h5 class="h6 mb-2">Secure Authentication</h5>
                      <p class="small text-muted mb-0">Secure API key management and data protection</p>
                    </div>
                  </div>
                  <div class="col-sm-6 mb-3">
                    <div class="feature-item">
                      <h5 class="h6 mb-2">Performance Optimized</h5>
                      <p class="small text-muted mb-0">Fast response times with efficient API calls</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Technical Implementation -->
              <div class="project-section mb-4">
                <h3 class="h4 mb-3">Technical Implementation</h3>
                <p class="mb-3">Built using modern web technologies with a focus on simplicity and reliability:</p>
                <div class="row">
                  <div class="col-sm-6">
                    <ul class="list-unstyled mb-0">
                      <li class="mb-2"><strong>Framework:</strong> Next.js with React</li>
                      <li class="mb-2"><strong>Language:</strong> TypeScript</li>
                      <li class="mb-2"><strong>API:</strong> NationBuilder REST API</li>
                    </ul>
                  </div>
                  <div class="col-sm-6">
                    <ul class="list-unstyled mb-0">
                      <li class="mb-2"><strong>Hosting:</strong> Vercel Platform</li>
                      <li class="mb-2"><strong>Authentication:</strong> OAuth 2.0</li>
                      <li class="mb-2"><strong>Integration:</strong> WordPress iframe</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Development Journey -->
              <div class="project-section mb-4">
                <h3 class="h4 mb-3">Development Journey</h3>
                
                <div class="development-timeline">
                  <div class="timeline-item mb-4">
                    <h5 class="h6 mb-2">Initial Prototyping</h5>
                    <p class="small mb-2">Started with Vercel's app builder using a development API token to create a Next.js prototype. While Vercel's agent provided a solid framework, the initial API implementation used deprecated endpoints that needed complete reconstruction.</p>
                  </div>
                  
                  <div class="timeline-item mb-4">
                    <h5 class="h6 mb-2">API Integration Challenges</h5>
                    <p class="small mb-2">Updated the API functionality to work with NationBuilder's current REST API endpoints. The original implementation had fundamental issues with the membership lookup logic that required a complete rewrite of the backend service layer.</p>
                  </div>
                  
                  <div class="timeline-item mb-4">
                    <h5 class="h6 mb-2">Authentication & Deployment</h5>
                    <p class="small mb-2">Transitioned from development tokens (24-hour validity) to OAuth 2.0 authentication. Drawing on experience from PepperHQ, implemented secure OAuth flows with NationBuilder as an authorized application. Deployed on Vercel's free tier for optimal cost-efficiency.</p>
                  </div>
                  
                  <div class="timeline-item mb-4">
                    <h5 class="h6 mb-2">WordPress Integration</h5>
                    <p class="small mb-2">Integrated the application into Bike Easy's WordPress website using iframe embedding. Resolved X-Frame-Options security restrictions by configuring appropriate CORS headers and frame policies to enable seamless website integration.</p>
                  </div>
                </div>
              </div>

              <!-- Impact -->
              <div class="project-section mb-4">
                <h3 class="h4 mb-3">Impact</h3>
                <div class="row">
                  <div class="col-md-12">
                    <h5 class="h6 mb-2">Results</h5>
                    <ul class="small mb-0">
                      <li>Reduced administrative workload for Bike Easy staff</li>
                      <li>Improved member experience with instant verification</li>
                      <li>Enhanced data accuracy through direct API integration</li>
                      <li>Streamlined event check-ins and membership verification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-lg-4">
              <!-- Project Meta Sidebar -->
              <div class="project-sidebar">
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <h5 class="card-title h6 mb-3">Technologies Used</h5>
                    <div class="mb-4">
                      <span class="badge badge-primary mr-1 mb-2">Next.js</span>
                      <span class="badge badge-primary mr-1 mb-2">React</span>
                      <span class="badge badge-primary mr-1 mb-2">TypeScript</span>
                      <span class="badge badge-primary mr-1 mb-2">NationBuilder API</span>
                      <span class="badge badge-primary mr-1 mb-2">OAuth 2.0</span>
                      <span class="badge badge-primary mr-1 mb-2">Vercel</span>
                    </div>
                    
                    <h6 class="h6 mb-2">Project Details</h6>
                    <div class="project-details">
                      <div class="mb-2">
                        <small class="text-muted d-block">Type</small>
                        <span>Non-profit Web Application</span>
                      </div>
                      <div class="mb-2">
                        <small class="text-muted d-block">Client</small>
                        <span>Bike Easy - New Orleans Bicycle Advocacy</span>
                      </div>
                      <div class="mb-2">
                        <small class="text-muted d-block">Role</small>
                        <span>Full Stack Developer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
