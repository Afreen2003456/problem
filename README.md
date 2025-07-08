# Airline Data Insights 🛩️

A comprehensive web application for analyzing airline data, flight trends, and market insights powered by AI. Built with FastAPI, modern frontend technologies, and OpenAI integration.

## 🚀 Features

### Core Functionality
- **Flight Search & Filtering**: Search flights by origin, destination, date, price range, and airline
- **Real-time Data Scraping**: Automated data collection from multiple airline sources
- **AI-Powered Insights**: OpenAI-generated analysis of flight trends and market patterns
- **Interactive Visualizations**: Dynamic charts for pricing trends, route popularity, and market share
- **Popular Routes Analysis**: Comprehensive route network analysis with hub identification
- **Price Trend Monitoring**: Historical pricing data and predictive analytics

### Technical Features
- **RESTful API**: Fully documented FastAPI backend with automatic OpenAPI documentation
- **Modern Frontend**: Responsive web interface with Bootstrap 5 and Chart.js
- **Professional Architecture**: Clean separation of concerns with services, scrapers, and models
- **Comprehensive Testing**: Full test coverage with pytest and integration tests
- **Error Handling**: Robust error handling with graceful fallbacks
- **Configuration Management**: Environment-based configuration with sensible defaults

## 🏗️ Architecture

```
airline-data-insights/
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── main.py         # Main FastAPI application
│   │   ├── scrapers/       # Data scraping modules
│   │   ├── services/       # Business logic services
│   │   └── __init__.py     # Package initialization
│   ├── config.py           # Configuration management
│   ├── requirements.txt    # Python dependencies
│   └── run.py             # Application runner
├── frontend/               # Web frontend
│   ├── index.html         # Main HTML interface
│   ├── styles.css         # Custom styling
│   └── app.js             # JavaScript functionality
├── tests/                  # Test suites
│   └── test_api.py        # Comprehensive API tests
└── README.md              # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Modern web browser
- OpenAI API key (optional - will use mock data if not provided)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd airline-data-insights
   ```

2. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables** (optional)
   Create a `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   DEBUG=true
   HOST=localhost
   PORT=8000
   ```

5. **Run the backend server**
   ```bash
   python run.py
   ```

   The API will be available at `http://localhost:8000`
   API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Serve the frontend**
   You can use any static file server:
   
   **Option 1: Python HTTP server**
   ```bash
   python -m http.server 8080
   ```
   
   **Option 2: Live Server (VS Code extension)**
   - Install Live Server extension
   - Right-click on `index.html` and select "Open with Live Server"
   
   **Option 3: Any other static file server**

3. **Access the application**
   Open your browser and go to `http://localhost:8080` (or your server's URL)

## 📊 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication
No authentication required for this demo version.

### Endpoints

#### Flight Search
```http
POST /flights/search
Content-Type: application/json

{
  "origin": "JFK",
  "destination": "LAX",
  "date": "2024-01-15",
  "min_price": 200,
  "max_price": 800,
  "airline": "American Airlines"
}
```

#### Popular Routes
```http
GET /routes/popular
```

#### Pricing Trends
```http
GET /trends/pricing
```

#### AI Insights
```http
GET /insights/generate
```

#### Scraping Status
```http
GET /scraping/status
POST /scraping/trigger
```

For complete API documentation, visit `http://localhost:8000/docs` when the server is running.

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
python -m pytest tests/ -v
```

### Test Coverage
The test suite includes:
- API endpoint testing
- Data validation testing
- Service layer testing
- Integration testing
- Error handling testing

### Manual Testing
1. Start the backend server
2. Open the frontend in a browser
3. Test flight search functionality
4. Verify chart visualizations
5. Check AI insights generation

## 🌐 Deployment

### Local Development
Follow the installation steps above for local development.

### Production Deployment

#### Option 1: Traditional Server
1. **Prepare the server**
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip nginx
   ```

2. **Deploy backend**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
   ```

3. **Serve frontend with nginx**
   Configure nginx to serve static files and proxy API requests.

#### Option 2: Docker (Recommended)
```bash
# Build and run with Docker
docker build -t airline-insights .
docker run -p 8000:8000 airline-insights
```

#### Option 3: Cloud Platforms
- **Heroku**: Use the provided `Procfile`
- **AWS**: Deploy with Elastic Beanstalk or ECS
- **Google Cloud**: Use App Engine or Cloud Run
- **Azure**: Deploy with App Service

### Environment Configuration
Set these environment variables in production:
```env
OPENAI_API_KEY=your_production_key
DEBUG=false
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=https://yourdomain.com
```

## 🎯 Usage Examples

### Basic Flight Search
```javascript
// Search for flights
const response = await fetch('http://localhost:8000/flights/search', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    origin: 'JFK',
    destination: 'LAX',
    date: '2024-01-15'
  })
});
const data = await response.json();
console.log(data.flights);
```

### Get Popular Routes
```javascript
const routes = await fetch('http://localhost:8000/routes/popular');
const data = await routes.json();
console.log(data.routes);
```

### Generate AI Insights
```javascript
const insights = await fetch('http://localhost:8000/insights/generate');
const data = await insights.json();
console.log(data.insights);
```

## 🔧 Configuration

### Backend Configuration
Modify `backend/config.py` to adjust:
- API endpoints and timeouts
- Sample data generation settings
- OpenAI service configuration
- CORS settings

### Frontend Configuration
Modify `frontend/app.js` to adjust:
- API base URL
- Chart configurations
- UI behavior and styling

## 📈 Data Sources

### Current Implementation
- **Sample Data Generator**: Creates realistic flight data for demonstration
- **Mock Route Networks**: Generates route analysis from major US airports
- **Simulated Market Data**: Provides trends and pricing analysis

### Future Enhancements
- Real airline API integration (Amadeus, Skyscanner, etc.)
- Live data feeds
- Historical data storage
- Machine learning price predictions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues

**Backend won't start:**
- Check Python version (3.8+ required)
- Ensure all dependencies are installed
- Verify port 8000 is available

**Frontend not loading:**
- Check if backend is running on localhost:8000
- Verify CORS settings in backend configuration
- Try a different port for the frontend server

**OpenAI integration not working:**
- Verify API key is set correctly
- Check internet connection
- Application will use mock data if OpenAI is unavailable

### Getting Help
- Check the API documentation at `/docs`
- Review the test files for usage examples
- Open an issue on GitHub for bug reports

## 🚧 Future Roadmap

### Phase 1 (Current)
- ✅ Basic flight search functionality
- ✅ AI-powered insights generation
- ✅ Interactive data visualizations
- ✅ Comprehensive testing suite

### Phase 2 (Planned)
- [ ] Real airline API integration
- [ ] User authentication and profiles
- [ ] Advanced filtering and sorting
- [ ] Email notifications for price alerts
- [ ] Mobile app development

### Phase 3 (Future)
- [ ] Machine learning price predictions
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Enterprise features and API

## 🙏 Acknowledgments

- OpenAI for AI insights generation
- FastAPI for the excellent web framework
- Chart.js for beautiful visualizations
- Bootstrap for responsive design
- The open-source community for tools and libraries

---

**Built with ❤️ using FastAPI, OpenAI, and modern web technologies** 