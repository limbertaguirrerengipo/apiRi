module.exports = {
    'apps': [
        {
            'name': 'apiRifa',
            'script': 'server.js',

            'env': {
                'PORT': 4004,
                'NODE_ENV': 'development'
            },
            'env_qa': {
                'PORT': 4004,
                'NODE_ENV': 'qa'
            },
            'env_production': {
                'PORT': 4004,
                'NODE_ENV': 'production'
            }
        }
    ]
};
