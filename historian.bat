For /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
For /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
echo %mydate%_%mytime%


xcopy /y "D:\gams\optimization_spinning.xlsm" "C:\gams_backup\historian\optimization_spinning_%mydate%_%mytime%_.xlsm"