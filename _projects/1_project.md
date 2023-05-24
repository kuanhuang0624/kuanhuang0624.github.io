---
layout: page
title: project 1
description: A Regional-Attentive Multi-Task Learning Framework for Breast Ultrasound Image Segmentation and Classification
img: 
importance: 1
category: work
---
Breast ultrasound (BUS) imaging is commonly used in the early detection of breast cancer as a portable, valuable, and widely available diagnosis tool. Automated BUS image classification and segmentation can assist radiologists in making accurate and fast decisions. Recent studies illustrate that tumor, peritumoral, and background regions of BUS images provide valuable information for BUS image segmentation or classification. However, few studies have investigated the influence of these three regions on multi-task learning. In this study, we propose an RMTL-Net to simultaneously segment tumor regions and classify tumors in BUS images into benign or malignant categories. To improve both segmentation and classification performance, we design a regional attention (RA) module that employs the predicted probability maps to automatically guide the classifier to learn important category-sensitive information in the tumor, peritumoral, and background regions and seamlessly fuse them to obtain a better feature representation. We conduct detailed ablation experiments of the proposed RA module and comparative experiments with four recent state-of-the-art peer multi-task learning methods, three single-task segmentation methods, and four single-task classification methods on two public BUS datasets. Experimental results show that the proposed RMTL-Net achieves the best overall segmentation and classification accuracy in terms of five segmentation metrics and six classification metrics.
