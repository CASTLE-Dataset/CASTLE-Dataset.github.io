---
title: "Home"
---


{{ video(url="vid/5x3_3min_1080.webm", alt="CASTLE preview", controls=false, autoplay=true) }}
To view the dataset in more detail, please use the [CASTLE Viewer](./castle-viewer/). More features will be added to the viewer in the future.

---

<div style="display: flex; flex-direction: row; gap: 1em; align-items: center;">

{{ image(url="./img/logo.png", alt="CASTLE logo", transparent=true, no_hover=true, extra_class="logo") }}

<div>

## What is CASTLE?

The CASTLE dataset is a large-scale, multimodal dataset designed for advancing research in lifelogging, human activity recognition, and multimodal retrieval. It provides a rich collection of time-aligned sensor and video data for analysis and benchmarking. See the [Paper](https://doi.org/10.1145/3746027.3758199) (or its [arXiv pre-print](https://arxiv.org/abs/2503.17116)) for more details.

</div>
</div>

---

## Characteristics

* Captured over **four days** in a controlled environment
* **10 participants** engaged in natural activities
* **15 video streams** (10 egocentric, 5 static perspectives)
* Over **600 hours** of UHD 50fps video with audio
* Includes **6DoF IMU, GPS, and biometric data**
* **8.22TB** total size

{{ image(url="./img/Castle-with-camera.png", alt="House layout with camera positions (not to scale)") }}

---

# Download

## License

The CASTLE dataset is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.

## Terms of Use

By downloading the dataset, you agree to the following terms:

* The dataset is provided for research purposes only.
* You will not use the dataset for any commercial purposes.
* You will not distribute the dataset or any derivative works to others.
* You will provide appropriate credit to the dataset authors in your publications.


{% alert(important=true) %}
The dataset is available for download from
<a class="external" href="https://huggingface.co/datasets/CASTLE-Dataset/CASTLE2024">HuggingFace</a>
{% end %}

---

# Challenges
We are organizing a series of challenges to encourage the research community to explore and utilize the CASTLE dataset.

To see the list of challenges and their details, please visit the [Challenges](./challenges) page.
