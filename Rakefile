desc 'Build all changed haml files'
task :build do
  files = `git status --porcelain`
  files = files.split("\n")
  files.each do |file|
    file[0] = "" if file[0] == " "
    if file[0] == "M" and file.include? 'haml'
      haml_file = file[2..-1]
      html_file = haml_file.gsub("haml", "html")
      `haml #{haml_file} #{html_file}`
      puts "Updated: #{html_file}"
    end
  end
  # from_path = File.join(File.dirname(__FILE__))
  # Dir["#{from_path}/**/*.haml"].each do |file|
  #   puts file
  #   # for each .haml file in the path, build into html
  #   output_file = file.gsub(/\.haml$/, '.html')
  #   `haml #{file} #{output_file}`
  # end
end
