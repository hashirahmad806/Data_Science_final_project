import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '../components/ui';

export default function TeamMethodology() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Team & Methodology</h2>
        <p className="text-secondary max-w-3xl">
          Meet the team behind VeritasAI and download our final reports and code artifacts.
        </p>
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-6">The Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(num => (
            <Card key={num} className="text-center">
              <div className="w-16 h-16 bg-surface-variant rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold text-secondary">
                S{num}
              </div>
              <h4 className="font-bold text-primary">Student Name {num}</h4>
              <p className="text-xs text-secondary mt-1 font-mono">ID-{2024000 + num}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 p-6 bg-primary-container text-on-primary-container rounded-lg text-center">
          <p className="font-semibold">Department of Computer Science</p>
          <p className="text-sm mt-1">University of Engineering & Technology, Peshawar</p>
          <p className="text-xs mt-3 opacity-80">Semester 4, 2024–25</p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-6">Dataset & Data Files</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader title="Cleaned Dataset (CSV)" subtitle="Deduplicated, preprocessed dataset used for training" />
            <div className="text-xs font-mono text-secondary mb-4">
              39,105 rows &times; 13 columns &middot; 96.6 MB
            </div>
            <a 
              href="/api/downloads/cleaned-dataset.csv" 
              download
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-primary px-4 py-2 rounded hover:bg-primary-container transition-colors cursor-pointer"
            >
              Download CSV
            </a>
          </Card>
          
          <Card>
            <CardHeader title="Data Dictionary" subtitle="Column names, data types, and field descriptions" />
            <div className="text-xs font-mono text-secondary mb-4">
              3 columns &middot; 1.2 KB
            </div>
            <a 
              href="/api/downloads/data-dictionary" 
              download
              className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary px-4 py-2 rounded hover:bg-surface-variant transition-colors cursor-pointer"
            >
              Download CSV
            </a>
          </Card>

          <Card>
            <CardHeader title="Raw ISOT Dataset" subtitle="Original source dataset from UVic / Kaggle" />
            <div className="text-xs font-mono text-secondary mb-4">
              Two files (True/Fake) &middot; ~110 MB total
            </div>
            <a 
              href="https://www.uvic.ca/engineering/ece/isot/datasets/fake-news/index.php" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary px-4 py-2 rounded hover:bg-surface-variant transition-colors"
            >
              External Source Link
            </a>
          </Card>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-6">Project Artifacts & Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader title="Final Project Report" subtitle="Comprehensive documentation of all phases" />
              <div className="text-xs font-mono text-secondary mb-4">
                14 pages &middot; 1.8 MB
              </div>
            </div>
            <a 
              href="/public/downloads/final_report.pdf" 
              download
              className="inline-block w-max text-sm font-medium text-white bg-primary px-4 py-2 rounded hover:bg-primary-container transition-colors"
            >
              Download PDF
            </a>
          </Card>
          
          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader title="Presentation Slides" subtitle="Executive summary and key findings" />
              <div className="text-xs font-mono text-secondary mb-4">
                24 slides &middot; 4.5 MB
              </div>
            </div>
            <a 
              href="/public/downloads/presentation_slides.pptx" 
              download
              className="inline-block w-max text-sm font-medium text-primary border border-primary px-4 py-2 rounded hover:bg-surface-variant transition-colors"
            >
              Download PPTX
            </a>
          </Card>
          
          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader title="Source Code (GitHub)" subtitle="Full repository with Jupyter Notebooks" />
              <div className="text-xs font-mono text-secondary mb-4">
                Public Repo &middot; Git Version Control
              </div>
            </div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-block w-max text-sm font-medium text-primary border border-primary px-4 py-2 rounded hover:bg-surface-variant transition-colors"
            >
              View Repository
            </a>
          </Card>

          <Card className="flex flex-col justify-between bg-primary-container/20 border-primary/20">
            <div>
              <CardHeader title="Data Science Notebooks" subtitle="Interactive Jupyter Notebook pipelines" />
              <div className="text-xs font-mono text-secondary mb-4">
                3 Notebooks &middot; pre-rendered previews
              </div>
            </div>
            <Link 
              to="/notebooks" 
              className="inline-block w-max text-sm font-medium text-primary border border-primary px-4 py-2 rounded hover:bg-surface-variant transition-colors"
            >
              View Notebooks &rarr;
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
