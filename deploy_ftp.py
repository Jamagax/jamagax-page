import os
from ftplib import FTP
import time

# CONFIGURATION
# ---------------------------------------------------------
# CHANGE THESE OR SET ENVIRONMENT VARIABLES
FTP_HOST = os.environ.get('FTP_HOST', 'ftp.hostinger.com')
FTP_USER = os.environ.get('FTP_USER', 'u123456789') 
FTP_PASS = os.environ.get('FTP_PASS', 'password_here')
LOCAL_DIR = 'dist'
REMOTE_DIR = 'public_html/jamagax' # Adjust this to your remote path
# ---------------------------------------------------------

def deploy():
    print("🌀 JAMAGAX QUANTUM DEPLOYER INITIALIZED")
    
    if FTP_USER == 'u123456789' or FTP_PASS == 'password_here':
        print("❌ ERROR: Please configure FTP_USER and FTP_PASS in the script or environment variables.")
        return

    if not os.path.exists(LOCAL_DIR):
        print(f"❌ ERROR: Local directory '{LOCAL_DIR}' not found. Run BUILD_DIST.bat first.")
        return

    try:
        print(f"📡 Connecting to {FTP_HOST}...")
        ftp = FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        print("✅ Connection Established.")

        # Navigate to remote directory
        try:
            ftp.cwd(REMOTE_DIR)
            print(f"📂 Navigated to {REMOTE_DIR}")
        except:
            print(f"⚠️ Remote directory {REMOTE_DIR} not found. Creating...")
            ftp.mkd(REMOTE_DIR)
            ftp.cwd(REMOTE_DIR)

        # Upload files
        print("🚀 Uploading Artifacts...")
        files = os.listdir(LOCAL_DIR)
        
        for file_name in files:
            local_path = os.path.join(LOCAL_DIR, file_name)
            if os.path.isfile(local_path):
                print(f"   -> Uploading {file_name}...")
                with open(local_path, 'rb') as f:
                    ftp.storbinary(f'STOR {file_name}', f)
            elif os.path.isdir(local_path):
                # Simple handling for assets folder (non-recursive for now unless needed)
                print(f"   -> creating folder {file_name}")
                try: ftp.mkd(file_name) 
                except: pass
                
                subfiles = os.listdir(local_path)
                for sub in subfiles:
                    sub_path = os.path.join(local_path, sub)
                    if os.path.isfile(sub_path):
                         print(f"      -> Uploading {file_name}/{sub}...")
                         with open(sub_path, 'rb') as f:
                            ftp.storbinary(f'STOR {file_name}/{sub}', f)

        ftp.quit()
        print("✨ DEPLOYMENT COMPLETE. The lattice has been updated.")

    except Exception as e:
        print(f"❌ DEPLOYMENT FAILED: {str(e)}")

if __name__ == "__main__":
    deploy()
