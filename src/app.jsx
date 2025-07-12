import React, { useState, useEffect } from 'react';
import { Copy, Check, FileText, Star, MapPin, Calendar, Users, Building, Settings, ChevronDown, ChevronUp, CheckCircle, AlertCircle, XCircle, Eye } from 'lucide-react';

const SchemaMarkupGenerator = () => {
  const [selectedSchema, setSelectedSchema] = useState('LocalBusiness');
  const [formData, setFormData] = useState({});
  const [copiedScript, setCopiedScript] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationResults, setValidationResults] = useState({ isValid: true, errors: [], warnings: [] });
  const [showValidator, setShowValidator] = useState(false);

  const schemaTypes = {
    LocalBusiness: {
      name: 'Local Business',
      icon: Building,
      description: 'Perfect for restaurants, shops, services, and local companies',
      fields: {
        name: { label: 'Business Name', type: 'text', required: true, placeholder: 'Your Business Name' },
        description: { label: 'Description', type: 'textarea', required: true, placeholder: 'Brief description of your business' },
        telephone: { label: 'Phone Number', type: 'tel', required: true, placeholder: '+1-555-123-4567' },
        email: { label: 'Email', type: 'email', required: false, placeholder: 'contact@yourbusiness.com' },
        url: { label: 'Website URL', type: 'url', required: true, placeholder: 'https://yourbusiness.com' },
        streetAddress: { label: 'Street Address', type: 'text', required: true, placeholder: '123 Main Street' },
        addressLocality: { label: 'City', type: 'text', required: true, placeholder: 'New York' },
        addressRegion: { label: 'State/Region', type: 'text', required: true, placeholder: 'NY' },
        postalCode: { label: 'Postal Code', type: 'text', required: true, placeholder: '10001' },
        addressCountry: { label: 'Country', type: 'text', required: true, placeholder: 'US' },
        priceRange: { label: 'Price Range', type: 'text', required: false, placeholder: '$$' },
        openingHours: { label: 'Opening Hours', type: 'text', required: false, placeholder: 'Mo-Fr 09:00-17:00' }
      }
    },
    Article: {
      name: 'Article/Blog Post',
      icon: FileText,
      description: 'Great for blog posts, news articles, and editorial content',
      fields: {
        headline: { label: 'Article Title', type: 'text', required: true, placeholder: 'Your Article Title' },
        description: { label: 'Article Description', type: 'textarea', required: true, placeholder: 'Brief summary of your article' },
        author: { label: 'Author Name', type: 'text', required: true, placeholder: 'John Doe' },
        datePublished: { label: 'Publication Date', type: 'date', required: true, placeholder: '' },
        dateModified: { label: 'Last Modified', type: 'date', required: false, placeholder: '' },
        url: { label: 'Article URL', type: 'url', required: true, placeholder: 'https://yourblog.com/article' },
        image: { label: 'Featured Image URL', type: 'url', required: false, placeholder: 'https://yourblog.com/image.jpg' },
        publisher: { label: 'Publisher Name', type: 'text', required: true, placeholder: 'Your Blog Name' },
        mainEntityOfPage: { label: 'Main Page URL', type: 'url', required: false, placeholder: 'https://yourblog.com' }
      }
    },
    Product: {
      name: 'Product',
      icon: Star,
      description: 'Essential for e-commerce and product showcase pages',
      fields: {
        name: { label: 'Product Name', type: 'text', required: true, placeholder: 'Amazing Product' },
        description: { label: 'Product Description', type: 'textarea', required: true, placeholder: 'Detailed description of your product' },
        brand: { label: 'Brand Name', type: 'text', required: true, placeholder: 'Your Brand' },
        sku: { label: 'SKU', type: 'text', required: false, placeholder: 'ABC123' },
        image: { label: 'Product Image URL', type: 'url', required: false, placeholder: 'https://yourstore.com/product.jpg' },
        price: { label: 'Price', type: 'number', required: true, placeholder: '99.99' },
        priceCurrency: { label: 'Currency', type: 'text', required: true, placeholder: 'USD' },
        availability: { label: 'Availability', type: 'select', required: true, options: ['InStock', 'OutOfStock', 'PreOrder'], placeholder: 'InStock' },
        condition: { label: 'Condition', type: 'select', required: false, options: ['NewCondition', 'UsedCondition', 'RefurbishedCondition'], placeholder: 'NewCondition' },
        url: { label: 'Product URL', type: 'url', required: true, placeholder: 'https://yourstore.com/product' }
      }
    },
    Event: {
      name: 'Event',
      icon: Calendar,
      description: 'Perfect for conferences, workshops, concerts, and meetings',
      fields: {
        name: { label: 'Event Name', type: 'text', required: true, placeholder: 'Amazing Conference 2024' },
        description: { label: 'Event Description', type: 'textarea', required: true, placeholder: 'What this event is about' },
        startDate: { label: 'Start Date & Time', type: 'datetime-local', required: true, placeholder: '' },
        endDate: { label: 'End Date & Time', type: 'datetime-local', required: false, placeholder: '' },
        locationName: { label: 'Venue Name', type: 'text', required: true, placeholder: 'Convention Center' },
        streetAddress: { label: 'Street Address', type: 'text', required: true, placeholder: '123 Event Street' },
        addressLocality: { label: 'City', type: 'text', required: true, placeholder: 'New York' },
        addressRegion: { label: 'State/Region', type: 'text', required: true, placeholder: 'NY' },
        postalCode: { label: 'Postal Code', type: 'text', required: true, placeholder: '10001' },
        addressCountry: { label: 'Country', type: 'text', required: true, placeholder: 'US' },
        organizer: { label: 'Organizer Name', type: 'text', required: true, placeholder: 'Event Company' },
        url: { label: 'Event URL', type: 'url', required: false, placeholder: 'https://yourevent.com' },
        image: { label: 'Event Image URL', type: 'url', required: false, placeholder: 'https://yourevent.com/image.jpg' }
      }
    },
    Organization: {
      name: 'Organization',
      icon: Users,
      description: 'Ideal for companies, nonprofits, and institutions',
      fields: {
        name: { label: 'Organization Name', type: 'text', required: true, placeholder: 'Your Organization' },
        description: { label: 'Description', type: 'textarea', required: true, placeholder: 'What your organization does' },
        url: { label: 'Website URL', type: 'url', required: true, placeholder: 'https://yourorg.com' },
        logo: { label: 'Logo URL', type: 'url', required: false, placeholder: 'https://yourorg.com/logo.png' },
        telephone: { label: 'Phone Number', type: 'tel', required: false, placeholder: '+1-555-123-4567' },
        email: { label: 'Email', type: 'email', required: false, placeholder: 'info@yourorg.com' },
        streetAddress: { label: 'Street Address', type: 'text', required: false, placeholder: '123 Organization St' },
        addressLocality: { label: 'City', type: 'text', required: false, placeholder: 'New York' },
        addressRegion: { label: 'State/Region', type: 'text', required: false, placeholder: 'NY' },
        postalCode: { label: 'Postal Code', type: 'text', required: false, placeholder: '10001' },
        addressCountry: { label: 'Country', type: 'text', required: false, placeholder: 'US' },
        foundingDate: { label: 'Founded Date', type: 'date', required: false, placeholder: '' }
      }
    }
  };

  const validateSchema = (schemaObj) => {
    const errors = [];
    const warnings = [];
    
    if (!schemaObj['@context']) {
      errors.push('Missing @context property');
    }
    if (!schemaObj['@type']) {
      errors.push('Missing @type property');
    }

    if (selectedSchema === 'LocalBusiness') {
      if (!formData.name?.trim()) errors.push('Business name is required');
      if (!formData.description?.trim()) errors.push('Business description is required');
      if (!formData.telephone?.trim()) errors.push('Phone number is required');
      if (!formData.url?.trim()) errors.push('Website URL is required');
      if (!formData.streetAddress?.trim()) errors.push('Street address is required');
      if (!formData.addressLocality?.trim()) errors.push('City is required');
      if (!formData.addressRegion?.trim()) errors.push('State/Region is required');
      if (!formData.postalCode?.trim()) errors.push('Postal code is required');
      if (!formData.addressCountry?.trim()) errors.push('Country is required');
      
      if (formData.url && !isValidUrl(formData.url)) {
        errors.push('Website URL must be a valid URL (include https://)');
      }
      if (formData.telephone && !isValidPhone(formData.telephone)) {
        warnings.push('Phone number format could be improved (e.g., +1-555-123-4567)');
      }
    }
    
    if (selectedSchema === 'Article') {
      if (!formData.headline?.trim()) errors.push('Article title is required');
      if (!formData.description?.trim()) errors.push('Article description is required');
      if (!formData.author?.trim()) errors.push('Author name is required');
      if (!formData.datePublished?.trim()) errors.push('Publication date is required');
      if (!formData.url?.trim()) errors.push('Article URL is required');
      if (!formData.publisher?.trim()) errors.push('Publisher name is required');
      
      if (formData.url && !isValidUrl(formData.url)) {
        errors.push('Article URL must be a valid URL');
      }
      if (formData.image && !isValidUrl(formData.image)) {
        warnings.push('Featured image should be a valid URL');
      }
      if (formData.headline && formData.headline.length > 110) {
        warnings.push('Headlines over 110 characters may be truncated in search results');
      }
    }
    
    if (selectedSchema === 'Product') {
      if (!formData.name?.trim()) errors.push('Product name is required');
      if (!formData.description?.trim()) errors.push('Product description is required');
      if (!formData.brand?.trim()) errors.push('Brand name is required');
      if (!formData.price?.trim()) errors.push('Price is required');
      if (!formData.priceCurrency?.trim()) errors.push('Currency is required');
      if (!formData.availability?.trim()) errors.push('Availability is required');
      if (!formData.url?.trim()) errors.push('Product URL is required');
      
      if (formData.price && isNaN(parseFloat(formData.price))) {
        errors.push('Price must be a valid number');
      }
      if (formData.url && !isValidUrl(formData.url)) {
        errors.push('Product URL must be a valid URL');
      }
      if (!formData.image) {
        warnings.push('Adding a product image URL improves SEO performance');
      }
    }
    
    if (selectedSchema === 'Event') {
      if (!formData.name?.trim()) errors.push('Event name is required');
      if (!formData.description?.trim()) errors.push('Event description is required');
      if (!formData.startDate?.trim()) errors.push('Start date is required');
      if (!formData.locationName?.trim()) errors.push('Venue name is required');
      if (!formData.streetAddress?.trim()) errors.push('Street address is required');
      if (!formData.addressLocality?.trim()) errors.push('City is required');
      if (!formData.addressRegion?.trim()) errors.push('State/Region is required');
      if (!formData.postalCode?.trim()) errors.push('Postal code is required');
      if (!formData.addressCountry?.trim()) errors.push('Country is required');
      if (!formData.organizer?.trim()) errors.push('Organizer name is required');
      
      if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
        errors.push('End date must be after start date');
      }
      if (formData.url && !isValidUrl(formData.url)) {
        warnings.push('Event URL should be a valid URL');
      }
    }
    
    if (selectedSchema === 'Organization') {
      if (!formData.name?.trim()) errors.push('Organization name is required');
      if (!formData.description?.trim()) errors.push('Description is required');
      if (!formData.url?.trim()) errors.push('Website URL is required');
      
      if (formData.url && !isValidUrl(formData.url)) {
        errors.push('Website URL must be a valid URL');
      }
      if (formData.logo && !isValidUrl(formData.logo)) {
        warnings.push('Logo should be a valid URL');
      }
      if (!formData.logo) {
        warnings.push('Adding a logo URL helps with brand recognition in search results');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return string.startsWith('http://') || string.startsWith('https://');
    } catch (_) {
      return false;
    }
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  };

  useEffect(() => {
    try {
      const schemaObj = JSON.parse(generateSchema());
      const validation = validateSchema(schemaObj);
      setValidationResults(validation);
    } catch (error) {
      setValidationResults({
        isValid: false,
        errors: ['Invalid JSON structure'],
        warnings: []
      });
    }
  }, [formData, selectedSchema]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSchema = () => {
    const schema = { "@context": "https://schema.org" };
    
    if (selectedSchema === 'LocalBusiness') {
      schema["@type"] = "LocalBusiness";
      schema.name = formData.name || "";
      schema.description = formData.description || "";
      schema.telephone = formData.telephone || "";
      schema.email = formData.email || "";
      schema.url = formData.url || "";
      schema.address = {
        "@type": "PostalAddress",
        streetAddress: formData.streetAddress || "",
        addressLocality: formData.addressLocality || "",
        addressRegion: formData.addressRegion || "",
        postalCode: formData.postalCode || "",
        addressCountry: formData.addressCountry || ""
      };
      if (formData.priceRange) schema.priceRange = formData.priceRange;
      if (formData.openingHours) schema.openingHours = formData.openingHours;
    } else if (selectedSchema === 'Article') {
      schema["@type"] = "Article";
      schema.headline = formData.headline || "";
      schema.description = formData.description || "";
      schema.author = {
        "@type": "Person",
        name: formData.author || ""
      };
      schema.datePublished = formData.datePublished || "";
      schema.dateModified = formData.dateModified || formData.datePublished || "";
      schema.url = formData.url || "";
      schema.publisher = {
        "@type": "Organization",
        name: formData.publisher || ""
      };
      if (formData.image) schema.image = formData.image;
      if (formData.mainEntityOfPage) schema.mainEntityOfPage = formData.mainEntityOfPage;
    } else if (selectedSchema === 'Product') {
      schema["@type"] = "Product";
      schema.name = formData.name || "";
      schema.description = formData.description || "";
      schema.brand = {
        "@type": "Brand",
        name: formData.brand || ""
      };
      if (formData.sku) schema.sku = formData.sku;
      if (formData.image) schema.image = formData.image;
      schema.offers = {
        "@type": "Offer",
        price: formData.price || "",
        priceCurrency: formData.priceCurrency || "USD",
        availability: `https://schema.org/${formData.availability || "InStock"}`,
        url: formData.url || ""
      };
      if (formData.condition) schema.offers.itemCondition = `https://schema.org/${formData.condition}`;
    } else if (selectedSchema === 'Event') {
      schema["@type"] = "Event";
      schema.name = formData.name || "";
      schema.description = formData.description || "";
      schema.startDate = formData.startDate || "";
      if (formData.endDate) schema.endDate = formData.endDate;
      schema.location = {
        "@type": "Place",
        name: formData.locationName || "",
        address: {
          "@type": "PostalAddress",
          streetAddress: formData.streetAddress || "",
          addressLocality: formData.addressLocality || "",
          addressRegion: formData.addressRegion || "",
          postalCode: formData.postalCode || "",
          addressCountry: formData.addressCountry || ""
        }
      };
      schema.organizer = {
        "@type": "Organization",
        name: formData.organizer || ""
      };
      if (formData.url) schema.url = formData.url;
      if (formData.image) schema.image = formData.image;
    } else if (selectedSchema === 'Organization') {
      schema["@type"] = "Organization";
      schema.name = formData.name || "";
      schema.description = formData.description || "";
      schema.url = formData.url || "";
      if (formData.logo) schema.logo = formData.logo;
      if (formData.telephone) schema.telephone = formData.telephone;
      if (formData.email) schema.email = formData.email;
      if (formData.streetAddress) {
        schema.address = {
          "@type": "PostalAddress",
          streetAddress: formData.streetAddress || "",
          addressLocality: formData.addressLocality || "",
          addressRegion: formData.addressRegion || "",
          postalCode: formData.postalCode || "",
          addressCountry: formData.addressCountry || ""
        };
      }
      if (formData.foundingDate) schema.foundingDate = formData.foundingDate;
    }

    return JSON.stringify(schema, null, 2);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedScript(text);
      setTimeout(() => setCopiedScript(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const generateScript = () => {
    const schemaJson = generateSchema();
    return `<script type="application/ld+json">
${schemaJson}
</script>`;
  };

  const currentSchemaConfig = schemaTypes[selectedSchema];
  const script = generateScript();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Schema Markup Generator</h1>
          <p className="text-lg text-gray-600">Create SEO-friendly structured data for your Webflow projects</p>
          <p className="text-sm text-gray-500 mt-2">No coding required • Copy & paste ready • Google-friendly</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Configure Your Schema</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Choose Schema Type</label>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(schemaTypes).map(([key, schema]) => {
                  const Icon = schema.icon;
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedSchema === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedSchema(key);
                        setFormData({});
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium text-gray-800">{schema.name}</h3>
                          <p className="text-sm text-gray-600">{schema.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                {currentSchemaConfig.name} Details
              </h3>
              
              {Object.entries(currentSchemaConfig.fields).map(([fieldKey, field]) => {
                const isRequired = field.required;
                const isAdvanced = !isRequired && !['name', 'description', 'url', 'telephone', 'email', 'headline', 'author', 'price', 'startDate'].includes(fieldKey);
                
                if (isAdvanced && !showAdvanced) return null;

                return (
                  <div key={fieldKey} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label} {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={formData[fieldKey] || ''}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={formData[fieldKey] || ''}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[fieldKey] || ''}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                );
              })}
              
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generated Script</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Generated Script</span>
                  <div className="flex items-center space-x-2">
                    {validationResults.isValid ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Valid</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">{validationResults.errors.length} Error{validationResults.errors.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {validationResults.warnings.length > 0 && (
                      <div className="flex items-center space-x-1 text-amber-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">{validationResults.warnings.length} Warning{validationResults.warnings.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowValidator(!showValidator)}
                    className="flex items-center space-x-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Validator</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(script)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ${
                      validationResults.isValid 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                    disabled={!validationResults.isValid}
                  >
                    {copiedScript === script ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copiedScript === script ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-md overflow-x-auto text-sm font-mono max-h-96 overflow-y-auto">
                {script}
              </pre>
            </div>

            {showValidator && (
              <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Schema Validator
                </h3>
                
                {validationResults.isValid && validationResults.warnings.length === 0 ? (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Perfect! Your schema markup is valid and ready to use.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {validationResults.errors.length > 0 && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-red-800">Errors (must fix):</span>
                        </div>
                        <ul className="space-y-1">
                          {validationResults.errors.map((error, index) => (
                            <li key={index} className="text-sm text-red-700 ml-7">• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {validationResults.warnings.length > 0 && (
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                          <span className="font-medium text-amber-800">Warnings (recommended):</span>
                        </div>
                        <ul className="space-y-1">
                          {validationResults.warnings.map((warning, index) => (
                            <li key={index} className="text-sm text-amber-700 ml-7">• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">✅ Validation Features:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Checks all required fields for your schema type</li>
                    <li>• Validates URL formats and data types</li>
                    <li>• Warns about SEO best practices</li>
                    <li>• Ensures Google-compatible JSON-LD structure</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">How to use in Webflow:</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">1</span>
                  <span>Copy the generated script above</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">2</span>
                  <span>In Webflow, go to your page settings</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">3</span>
                  <span>Paste the script in the "Before &lt;/head&gt; tag" section</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">4</span>
                  <span>Publish your site and test with Google's Rich Results Test</span>
                </li>
              </ol>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">✨ Pro Tips:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Fill in all required fields (marked with *) for best results</li>
                  <li>• Use descriptive text that matches your actual content</li>
                  <li>• Keep URLs absolute (including https://)</li>
                  <li>• Test your markup with Google's Rich Results Test</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaMarkupGenerator;