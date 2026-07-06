import React from "react";
import { Post } from "./blog/posts";

export interface TechItem {
  name: string;
  icon?: string;
}

export interface TechCategory {
  title: string;
  icon: string;
  techs: TechItem[];
}

export interface EducationItem {
  degree: string;
  school: string;
  year: string;
  score: string;
}

export interface CertificationItem {
  name: string;
  source: string;
  year?: string;
  badges?: string[];
  icon: React.ComponentType<{ size?: number }>;
}

export type ProjectCaseStudy = {
  problem: string;
  solution: string;
  keyFeatures: string[];
  architecture: {
    frontend: string;
    backend: string;
    data: string;
  };
};

export type ProjectItem = {
  title: string;
  slug: string;
  description: string;
  tech: string[];
  github: string;
  live?: string;
  demoUrl?: string;
  status: string;
  category: string;
  image: string;
  caseStudy: ProjectCaseStudy;
};

export type BlogPost = Post;

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormStatus {
  status: string;
  message: string;
}
