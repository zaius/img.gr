# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  
  def create_tab(url,text,selected_tab)
    selected = ""
    if selected_tab == url
      selected = ' class="active"'
    end
    '<li' + selected + '><a href="' + url +'">' + text + '</a></li>'
  end
  
end
