export const generateEmailTemplate = (title, content, mainCallToAction = null) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #FAFAFA;
                color: #2D2825;
                margin: 0;
                padding: 0;
            }
            .container {
                max-w-xl: 600px;
                margin: 40px auto;
                background-color: #FFFCF9;
                border: 1px solid #E9DAC1;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #2D2825;
                padding: 30px;
                text-align: center;
                border-bottom: 3px solid #CFAF65;
            }
            .header h1 {
                margin: 0;
                color: #FFFCF9;
                font-size: 28px;
                letter-spacing: 2px;
                text-transform: uppercase;
                font-family: Georgia, serif;
            }
            .content {
                padding: 40px 30px;
                line-height: 1.6;
            }
            .content h2 {
                color: #2D2825;
                margin-top: 0;
                font-family: Georgia, serif;
            }
            .btn-cta {
                display: inline-block;
                padding: 12px 24px;
                background-color: #A72814;
                color: #ffffff;
                text-decoration: none;
                font-weight: bold;
                border-radius: 4px;
                margin-top: 20px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .footer {
                background-color: #F3E5D8;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #5d534f;
                border-top: 1px solid #E9DAC1;
            }
            ul {
                background-color: #FAFAFA;
                border: 1px solid #E9DAC1;
                padding: 20px 40px;
                border-radius: 4px;
            }
            li {
                margin-bottom: 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Rangitva</h1>
            </div>
            
            <div class="content">
                <h2>${title}</h2>
                ${content}
                
                ${mainCallToAction ? `
                <div style="text-align: center; margin-top: 30px;">
                    <a href="${mainCallToAction.link}" class="btn-cta">${mainCallToAction.text}</a>
                </div>
                ` : ''}
            </div>
            
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Rangitva. All rights reserved.</p>
                <p>This is an automated message. Please do not reply directly to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
