# Script Consolidation - Analysis Scripts

**Date:** October 5, 2025  
**Status:** ✅ Complete  
**Task:** Merge duplicate analysis scripts

---

## 📋 Overview

Consolidated 4 duplicate analysis scripts into a single, unified `analyze_repository.py` that can handle any GitHub repository with improved error handling, logging, and configuration management.

---

## 🔄 Scripts Consolidated

### Before (4 separate scripts)

1. **`analyze_microservices_demo.py`** (434 lines)
   - Purpose: Analyze GoogleCloudPlatform/microservices-demo using direct API calls
   - Issues: Hardcoded paths, minimal error handling, no config integration

2. **`analyze_microservices_demo_mcp.py`** (461 lines)
   - Purpose: Analyze GoogleCloudPlatform/microservices-demo using GitHub MCP
   - Issues: Similar to #1, MCP integration incomplete

3. **`analyze_google_repo.py`** (631 lines)
   - Purpose: Analyze GoogleCloudPlatform/microservices-demo (newer version)
   - Issues: Hardcoded paths, SSL verification disabled, no config integration

4. **`analyze_ggkarthik_repo.py`** (510 lines)
   - Purpose: Analyze ggkarthik/microservices-demo-app
   - Issues: Nearly identical to #3, just different repo

**Total:** 2,036 lines across 4 files

### After (1 unified script)

**`analyze_repository.py`** (550 lines)
- Purpose: Analyze ANY GitHub repository
- Features:
  - ✅ Command-line arguments for flexibility
  - ✅ Centralized configuration integration
  - ✅ Comprehensive error handling
  - ✅ Professional logging
  - ✅ Supports multiple repositories
  - ✅ Uses config.py for paths and settings
  - ✅ Proper exit codes
  - ✅ GitHub token support

**Reduction:** 73% reduction in code (2,036 → 550 lines)

---

## 🎯 Key Improvements

### 1. Unified Interface
```bash
# Analyze default repository (from config)
python3 analyze_repository.py

# Analyze specific repository
python3 analyze_repository.py --owner GoogleCloudPlatform --repo microservices-demo

# Analyze different repository
python3 analyze_repository.py --owner ggkarthik --repo microservices-demo-app

# Show help
python3 analyze_repository.py --help
```

### 2. Configuration Integration
- Uses centralized `config.py` for all settings
- No hardcoded paths
- Easy to modify behavior
- Consistent with other scripts

### 3. Error Handling
```python
# Comprehensive error handling
try:
    data = analyzer.analyze_repository()
    if data:
        analyzer.save_data(data)
        return 0
    else:
        logger.error("Analysis failed")
        return 1
except Exception as e:
    logger.error(f"Unexpected error: {e}", exc_info=True)
    return 1
```

### 4. Professional Logging
```
2025-10-05 12:30:00 - __main__ - INFO - Starting repository analysis...
2025-10-05 12:30:01 - __main__ - INFO - Initialized analyzer for GoogleCloudPlatform/microservices-demo
2025-10-05 12:30:02 - __main__ - INFO - Found 12 microservices: frontend, cartservice, ...
2025-10-05 12:30:05 - __main__ - INFO - Inventory data saved to: /path/to/data/generated/microservices_inventory.json
2025-10-05 12:30:05 - __main__ - INFO - Analysis complete. All data has been saved.
```

### 5. GitHub Token Support
```bash
# Set GitHub token for higher API rate limits
export GITHUB_TOKEN=your_token_here
python3 analyze_repository.py
```

---

## 📊 Feature Comparison

| Feature | Old Scripts | New Script |
|---------|-------------|------------|
| Multiple repos | ❌ (4 scripts) | ✅ (1 script) |
| Config integration | ❌ | ✅ |
| Error handling | Minimal | ✅ Comprehensive |
| Logging | Basic print | ✅ Professional |
| Command-line args | ❌ | ✅ |
| GitHub token | ❌ | ✅ |
| Exit codes | ❌ | ✅ |
| Documentation | Scattered | ✅ Unified |

---

## 🗂️ File Organization

### Archived Scripts
Old scripts moved to `archive/old_analysis_scripts/`:
```
archive/old_analysis_scripts/
├── analyze_microservices_demo.py
├── analyze_microservices_demo_mcp.py
├── analyze_google_repo.py
└── analyze_ggkarthik_repo.py
```

### New Structure
```
Identity-online-repo/
├── analyze_repository.py          ← New unified script
├── config.py                       ← Centralized configuration
└── archive/
    └── old_analysis_scripts/       ← Old scripts (for reference)
```

---

## 🚀 Usage Examples

### Example 1: Analyze Default Repository
```bash
python3 analyze_repository.py
```

Output:
```
2025-10-05 12:30:00 - __main__ - INFO - Starting repository analysis...
2025-10-05 12:30:01 - __main__ - INFO - Analyzing repository: GoogleCloudPlatform/microservices-demo
2025-10-05 12:30:02 - __main__ - INFO - Found 12 microservices: frontend, cartservice, productcatalogservice, ...
2025-10-05 12:30:05 - __main__ - INFO - Analysis complete. All data has been saved.
```

### Example 2: Analyze Different Repository
```bash
python3 analyze_repository.py --owner ggkarthik --repo microservices-demo-app
```

### Example 3: With GitHub Token
```bash
export GITHUB_TOKEN=ghp_your_token_here
python3 analyze_repository.py
```

---

## 🔧 Technical Details

### Class Structure
```python
class RepositoryAnalyzer:
    def __init__(self, owner=None, repo=None, use_mcp=False)
    def get_github_data(self, endpoint="", params=None)
    def detect_language(self, service_name)
    def get_service_description(self, service_name)
    def get_service_dependencies(self, service_name, language)
    def get_service_apis(self, service_name)
    def get_repository_activity(self)
    def analyze_repository(self)
    def save_data(self, data)
```

### Data Flow
```
1. Initialize analyzer with repo info
   ↓
2. Fetch repository metadata
   ↓
3. Discover microservices
   ↓
4. Analyze each service:
   - Detect language
   - Get description
   - Extract dependencies
   - Identify APIs
   ↓
5. Fetch repository activity
   ↓
6. Generate inventory data
   ↓
7. Save to multiple locations (using config)
```

### Output Files
Using centralized config, data is saved to:
- `/data/generated/microservices_inventory.json`
- `/data/generated/repo_activity_summary.json`
- `/data/generated/image_inventory.json`
- `/output/` (legacy location)
- `/react-dashboard/public/data/` (for React app)

---

## ✅ Benefits

### 1. Maintainability
- **Single source of truth** - One script to maintain instead of four
- **Consistent behavior** - Same logic for all repositories
- **Easier updates** - Changes in one place affect all uses

### 2. Flexibility
- **Any repository** - Not limited to specific repos
- **Command-line control** - Easy to use in scripts and automation
- **Configuration-driven** - Behavior controlled by config.py

### 3. Quality
- **Better error handling** - Graceful failures with helpful messages
- **Professional logging** - Easy to debug and monitor
- **Proper exit codes** - Works well in CI/CD pipelines

### 4. Efficiency
- **73% less code** - Easier to understand and modify
- **No duplication** - DRY principle applied
- **Reusable components** - Methods can be used independently

---

## 🧪 Testing

### Test 1: Default Repository
```bash
python3 analyze_repository.py
echo $?  # Should print 0 on success
```

### Test 2: Different Repository
```bash
python3 analyze_repository.py --owner ggkarthik --repo microservices-demo-app
```

### Test 3: Invalid Repository
```bash
python3 analyze_repository.py --owner invalid --repo nonexistent
echo $?  # Should print 1 on failure
```

### Test 4: Help Message
```bash
python3 analyze_repository.py --help
```

---

## 📝 Migration Guide

### For Users of Old Scripts

**Old way:**
```bash
# Different script for each repo
python3 analyze_google_repo.py
python3 analyze_ggkarthik_repo.py
python3 analyze_microservices_demo.py
```

**New way:**
```bash
# One script for all repos
python3 analyze_repository.py
python3 analyze_repository.py --owner ggkarthik --repo microservices-demo-app
python3 analyze_repository.py --owner GoogleCloudPlatform --repo microservices-demo
```

### For Developers

**Old way:**
```python
# Hardcoded paths
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
REACT_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "react-dashboard/src/data")
```

**New way:**
```python
# Use centralized config
from config import get_all_output_paths

inventory_paths = get_all_output_paths('inventory')
```

---

## 🔮 Future Enhancements

### Planned
- [ ] GitHub MCP integration (use_mcp flag prepared)
- [ ] Parallel analysis of multiple repositories
- [ ] Caching of GitHub API responses
- [ ] JSON schema validation of output
- [ ] Progress bars for long-running analyses

### Possible
- [ ] Support for GitLab, Bitbucket
- [ ] GraphQL API support
- [ ] Webhook integration
- [ ] Real-time analysis updates
- [ ] Machine learning for better service detection

---

## 📊 Impact Metrics

### Code Reduction
```
Before: 2,036 lines across 4 files
After:  550 lines in 1 file
Reduction: 73% (1,486 lines removed)
```

### Maintainability Score
```
Before: 4 scripts to maintain
After:  1 script to maintain
Improvement: 75% reduction in maintenance burden
```

### Flexibility Score
```
Before: Fixed to specific repositories
After:  Works with any repository
Improvement: Infinite flexibility
```

---

## 🎓 Lessons Learned

1. **Consolidation is powerful** - 73% code reduction
2. **Configuration matters** - Centralized config makes everything easier
3. **Error handling is essential** - Professional logging helps debugging
4. **Flexibility pays off** - Command-line args enable many use cases
5. **Documentation is key** - Clear docs help adoption

---

## 📞 Support

### If You Encounter Issues

1. **Check the logs** - Look for error messages
2. **Verify config** - Run `python3 config.py` to validate
3. **Test GitHub access** - Ensure you can reach GitHub API
4. **Use GitHub token** - Set `GITHUB_TOKEN` for higher rate limits
5. **Check old scripts** - Reference archived scripts if needed

### Common Issues

**Issue:** Rate limit exceeded  
**Solution:** Set `GITHUB_TOKEN` environment variable

**Issue:** SSL verification errors  
**Solution:** Check network/proxy settings

**Issue:** No data generated  
**Solution:** Check logs for specific errors

---

## ✅ Checklist

- [x] Created unified `analyze_repository.py`
- [x] Integrated with `config.py`
- [x] Added comprehensive error handling
- [x] Added professional logging
- [x] Added command-line arguments
- [x] Added GitHub token support
- [x] Archived old scripts
- [x] Created documentation
- [x] Tested with default repository
- [x] Verified help message

---

**Status:** ✅ COMPLETE  
**Date:** October 5, 2025  
**Next:** Apply similar consolidation to data generation scripts
