# Deploying VitePress to GitHub Pages

VitePress makes it easy to build and deploy documentation sites. Here’s how you can deploy your VitePress site to GitHub Pages:

## 1. Build Your Site

Run the following command to generate the static files:
https://vitepress.dev/guide/getting-started

```bash
npm add -D vitepress
npx vitepress init
```

The output will be in the `.vitepress/dist` directory.

## (Optional) Sidebar
https://vitepress-sidebar.cdget.com/


## 2. Push to GitHub Pages


## 3. Configure Repository Settings

Go to your repository settings on GitHub and set GitHub Pages to use the `gh-pages` branch.

## 4. Access Your Site

Your site will be available at:

```
https://<USERNAME>.github.io/<REPO>/
```

## References

- [VitePress Deployment Guide](https://vitepress.dev/guide/deploy)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
