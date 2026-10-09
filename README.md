<<<<<<< HEAD
# House
House price prediction model
=======
# HousePrice AI — Flask + HTML/CSS/JavaScript

A complete house-price prediction web application using your trained `LinearRegression` model.

## Model input order

The API sends features in this exact order:

1. `House Size (sqft)`
2. `Number of Bedrooms`
3. `Number of Bathrooms`
4. `Number of Floors`

Target: `Price`

## Project structure

```text
house_price_predictor/
├── app.py
├── requirements.txt
├── README.md
├── model/
│   └── Linermodel.pkl
├── templates/
│   └── index.html
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

## Run locally on Windows

Open PowerShell in this folder:

```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Then open:

`http://127.0.0.1:5000`

## API

### POST `/api/predict`

Example JSON:

```json
{
  "House Size (sqft)": 1800,
  "Number of Bedrooms": 3,
  "Number of Bathrooms": 2,
  "Number of Floors": 2
}
```

The response contains the predicted price.

### GET `/api/health`

Checks that the Flask API is running.

## Important

The model was serialized with scikit-learn 1.6.1, so the requirements file pins that version to avoid model-loading compatibility problems.
>>>>>>> b68a26e (push the code in git hub)
