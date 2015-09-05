<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ title }}</title>
  
  {# css #}
  <link rel="stylesheet" href="/global/css/main/base.css">
  {% block css %}
  {% endblock %}
</head>
<body>
  {# body placeholder #}
  {% block body %}
  {% endblock %}

  {# js #}
  <script src="/global/js/main/index.js"></script>
  {% block js %}
  {% endblock %}
</body>
</html>