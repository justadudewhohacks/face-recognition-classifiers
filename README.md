
[fr]: https://github.com/justadudewhohacks/face-recognition.js
[cv]: https://github.com/justadudewhohacks/opencv4nodejs
[brain]: https://github.com/BrainJS/brain.js

# Comparison of different classifiers for [face-recognition.js][fr]

## Types of classifiers

- Euclidean Distance
- SVM - [opencv4nodejs][cv]
- Neural Network - [brain.js][brain]

## Datasets

- input: face descriptors (vectors with 128 entryies)
- 77 classes

### 105 x 105:

- ~ 50 - 150 face images / descriptors per class
- total of 7348 face images / descriptors

### 150 x 150:

- ~ 30 - 110 face images / descriptors per class
- total of 5496 face images / descriptors

## Data acquisition

All data has been aquired using [facedb-maker](https://github.com/justadudewhohacks/facedb-maker). Images have been scraped from google images, face locations detected with [opencv4nodejs][cv] and face descriptors computed with [opencv4nodejs][fr].

## Running the examples

Run a classifier with the 105 x 105 face dataset with 20 train samples per class, the remaining data will be used for testing:

``` shell
ts-node <classifier>.ts -f 105 -n 20 ... other classifier specific params
```

### Euclidean Distance Classifier

- uses a simple calculation of the mean of euclidean distances to each face descriptor of a class

``` shell
ts-node euclid.ts -f 105 -n 20
```

### SVM Classifier

- requires [opencv4nodejs][cv] to be installed (`npm i opencv4nodejs`)
- uses the OpenCV implementation of a multiclass SVM

with default parameters:

``` shell
ts-node svm.ts -f 105 -n 20
```

auto training, SVM parameters are figured out automatically by OpenCV:

``` shell
ts-node svm.ts -f 105 -n 20 -a
```

setting c, gamma and kernel type manually:

``` shell
ts-node svm.ts -f 105 -n 20 -c 12.5 -g 5.0625 -k RBF
```

parameters:

- c, c: number
- g, gamma: number
- k, kernel_type: RBF | LINEAR | SIGMOID | CHI2 | INTER

### Neural Network Classifier

- uses a Feed Forward Neural Network implemented in [brain.js][brain]

with default parameters:

``` shell
ts-node net.ts -f 105 -n 20
```

setting training parameters manually, stop training after max 5000 iterations, use relu activation function:

``` shell
ts-node net.ts -f 105 -n 20 -e 0.005 -r 0.1 -i 5000 -a relu
```

using hidden layers, input (128) -> hidden layer 1 (100) ->  hidden layer 2 (80) -> output layer (77):

``` shell
ts-node net.ts -f 105 -n 20 -l 100,80
```

parameters:

- e, error_threshold: number
- r, learning_rate: number
- m, momentum: number
- i, iterations: number
- a, activation: sigmoid | relu | leaky-relu | tanh
- l, hidden_layers: number[]

## Results

### Accuracy

105 x 105:

n  | Euclidean Distance | SVM   | Neural Network |
--:|:------------------:|:-----:|:--------------:|
5  | 54.5%              | 63.3% | 69.2%          |
10 | 62.9%              | 74.4% | 78.7%          |
20 | 68.1%              | 80.0% | 80.0%          |
40 | 70.2%              | 86.4% | 87.7%          |

150 x 150:

n  | Euclidean Distance | SVM    | Neural Network |
--:|:------------------:|:------:|:--------------:|
5  | 98.6%              | 98.4%  | 98.7%          |
10 | 98.6%              | 98.6%  | 98.7%          |
20 | 98.8%              | 98.8%  | 98.9%          |

Training Time:

105 x 105:

n  | SVM  | SVM auto   | Neural Network |
--:|:----:|:----------:|:--------------:|
5  | > 1s | ~ 4s       | ~ 11min        |
10 | ~ 1s | ~ 11s      | ~ 22min        |
20 | ~ 2s | ~ 40s      | ~ 47min        |
40 | ~ 2s | ~ 2min 10s | ~ 1h 40min     |

150 x 150:

n  | SVM  | SVM auto | Neural Network |
--:|:----:|:--------:|:--------------:|
5  | > 1s | ~ 4s     | ~ 6min 40s     |
10 | > 1s | ~ 12s    | ~ 8min 10s     |
20 | > 1s | ~ 39s    | ~ 9min 30s     |

### Average Classification Time per Input

n  | Euclidean Distance | SVM    | Neural Network |
--:|:------------------:|:------:|:--------------:|
5  | ~ 2 ms             | -      | -              |
10 | ~ 4 ms             | -      | -              |
20 | ~ 9 ms             | -      | -              |
40 | ~ 18 ms            | -      | -              |
80 | ~ 36 ms            | -      | -              |