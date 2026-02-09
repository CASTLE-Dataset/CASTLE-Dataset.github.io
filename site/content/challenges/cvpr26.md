+++
title = "CASTLE @ EgoVis - CVPR 2026"
weight = 3
[extra]
featured = true
+++

---

# 1st Asynchronous CASTLE Challenge at the Joint Egocentric Vision Workshop in Conjunction with CVPR 2026

We will hold a pilot task at the [3rd Joint Egocentric Vision Workshop (EgoVis)](https://egovis.github.io/cvpr25/) held in conjunction with [CVPR 2026](https://cvpr.thecvf.com/Conferences/2026) in June 2026 in Denver, Colorado, USA. The challenge builds upon prior challenges at EgoVis, as well as [IViSE](https://sites.google.com/view/ivise2025) and [the 1st CASTLE Grand Challenge at ACM Multimedia 2025](../challenges/mm25).

## Timeline

* **23 February 2026:** Queries Released
* **02 March 2026:** Challenge Platform Released
* **13 May 2026:** Final Run Submission Deadline


## Tasks

For this initial challenge, we offer one task. The varyity of tasks will be expanded in the future.

### 💬 Question Answering

This first task will focus on closed-form question answering. Given the entire dataset of over 600 hours of content from 15 different perspectives, you are asked to select the correct answer to a given question out of four possible options. This tasks requires video retrieval and long-form multi-stream video understanding to be solved. The queries will be given as a single JSON document using the following structure:

```json
{
  "2026_q1": {
    "query": "Question formulated in English",
    "answers": {
      "a": "First Answer Option",
      "b": "Second Answer Option",
      "c": "Third Answer Option",
      "d": "Fourth Answer Option"
    }
  }, 
  "2026_q2": {
    "query": "Another question formulated in English",
    "answers": {
      "a": "First Answer Option",
      "b": "Second Answer Option",
      "c": "Third Answer Option",
      "d": "Fourth Answer Option"
    }
  }, 
  ...
}
```


## Submission Format

Submissions are expected as a single JSON file in the following format.

```json
{
  "2026_q1": "a",
  "2026_q2": "c",
  ...
}
```

Submissions can be made via Codabench (link coming soon).
