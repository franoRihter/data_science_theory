# Data Analysis with Python
There are many Python libraries for data sciences. There are commonly separated in 3 categories. 
## Libraries for Computing
Libraries used for data manipulation and calculation. Python is known for it slow computing time. Since data science uses a lot of data that need to be edited there are many libraries created in other (mostly C) languages that are implemented in Python. Most famous libraries are Pandas, NumPy, SciPy.

## Libraries for Visualization
To decide what to do with data the best thing is to visuali reprezent it. This segment of data science is used to display the results to the clients but also to better represent the problem or distribution the data is hiding. Common tools are Matplotlib, Plotly and Seaborn.

## Libraries for Algorithms
Data science often uses algorithms that are adjusted for the given problem. Most solutions do not require new algorithm to be created. There are many libraries that have those algorithms already implemented. Most promenant library is Scikit-learn. Some more complex problems require Deep learning. For that models used are Tensorflow and PyTorch.

## Short example of working project:
Importing data:
Data is imported form the computer you are using or from the remote computer. Data can be stored in many formats (this example uses csv).
  import pandas as pandas
  dataframe = pd.read_csv(url)
Data frame can be one of the following types: object, int, float and datetime64.
One can list the data types using:
  dataframe.dtypes
Data distribution can be displayed using:
  dataframe.describe()
Summery of the dataframe is listed with:
  dataframe.info()
### dealing with missing data:
There are many ways in dealing with missing values. It is usually reccomended to do so in following order:
1. Chack if party that collected the data can determine what should be the value of the data.
2. If possible delete the rows with missing values. This is only acceptable if the data is still representable for the given problem.
3. Replace the data: Normalise the data. Guess the data point using avrage. Replace by frequency. Replace based on other factors.
4. Leave the data missing.

## Data is formated based on the analysts needs.

## Data Normalisation
Data is scaled so the features do not impact each other.
There are a lot of ways of normalising data. Some of them are.
1. Simple Feature Scaling: Devides value with maximum value in its column. 
2. Min-Max: takes value substracts minimum value in a column, then devides with (max value - min value).
3. Z-score: for each value you substrackt the avrage of the feature and devide with standard deviation.

## Binning data:
Creating a category. If we have data in range from 10 to 100 (lest say that is the age range of study participator). Binning would be separating it into categoryes like 10-18, 19-23, 24-35, 36-50, 51-67, 68-100.
This binning is done based on meturity of the participants. To determin the binning range is is often best to think of the way the bins should be organized. Bins are often separated in to categories of same (or similar) range.


