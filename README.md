# LMSCloud Koha Plugin Utilities

Shared utility modules for LMSCloud Koha plugins. This repository is designed to be used as a Git submodule across multiple plugins.

## Modules

### Pages.pm

Utility functions for managing Koha Pages (Additional Contents) programmatically.

**Functions:**

- `create_opac_page(%params)` - Create a new OPAC page

  - Parameters: `code`, `title`, `content`, `lang` (optional, default: 'default'), `branchcode` (optional)
  - Returns: The created page's ID
  - Example:

    ```perl
    use Koha::Plugin::Com::LMSCloud::Util::Pages qw( create_opac_page );

    my $page_id = create_opac_page({
        code    => 'my-custom-page',
        title   => 'My Custom Page',
        content => '<h1>Hello World</h1>',
        lang    => 'default',
    });
    ```

- `update_opac_page(%params)` - Update an existing OPAC page

  - Parameters: `code`, `title` (optional), `content` (optional), `lang` (optional, default: 'default'), `branchcode` (optional)
  - Returns: Boolean success status
  - Example:

    ```perl
    use Koha::Plugin::Com::LMSCloud::Util::Pages qw( update_opac_page );

    update_opac_page({
        code    => 'my-custom-page',
        content => '<h1>Updated Content</h1>',
    });
    ```

- `delete_opac_page($code, $branchcode)` - Delete an OPAC page

  - Parameters: `code` (required), `branchcode` (optional)
  - Returns: Boolean success status
  - Example:

    ```perl
    use Koha::Plugin::Com::LMSCloud::Util::Pages qw( delete_opac_page );

    delete_opac_page('my-custom-page');
    ```

- `opac_page_exists($code, $branchcode)` - Check if an OPAC page exists

  - Parameters: `code` (required), `branchcode` (optional)
  - Returns: Boolean existence status
  - Example:

    ```perl
    use Koha::Plugin::Com::LMSCloud::Util::Pages qw( opac_page_exists );

    if (opac_page_exists('my-custom-page')) {
        # Page exists
    }
    ```

### MigrationHelper.pm

Helper functions for database migrations in Koha plugins.

**Purpose:** Provides utilities for managing database schema changes across plugin versions, including table creation, modification, and data migration.

### I18N.pm

Internationalization helper functions for Koha plugins.

**Purpose:** Provides utilities for handling translations and locale-specific formatting in plugin code.

## Usage in Plugins

### Adding as a Submodule

To use this in your plugin, add it as a Git submodule:

```bash
cd your-plugin-repository
git submodule add https://github.com/lmscloudpauld/koha-plugin-lmscloud-util Koha/Plugin/Com/LMSCloud/Util
git submodule update --init --recursive
```

### Importing Modules

In your plugin code:

```perl
use Koha::Plugin::Com::LMSCloud::Util::Pages qw( create_opac_page delete_opac_page );
use Koha::Plugin::Com::LMSCloud::Util::MigrationHelper;
use Koha::Plugin::Com::LMSCloud::Util::I18N;
```

### Example: Creating a Page in Install Hook

```perl
sub install {
    my ($self) = @_;

    use Koha::Plugin::Com::LMSCloud::Util::Pages qw( create_opac_page );

    my $page_content = $self->mbf_read('my_page_content.html');

    my $page_id = create_opac_page({
        code    => 'my-plugin-page',
        title   => 'My Plugin Page',
        content => $page_content,
        lang    => 'default',
    });

    return 1;
}
```

### Example: Cleaning Up in Uninstall Hook

```perl
sub uninstall {
    my ($self) = @_;

    use Koha::Plugin::Com::LMSCloud::Util::Pages qw( delete_opac_page );

    delete_opac_page('my-plugin-page');

    return 1;
}
```

## Development

### Making Changes

When making changes to these utilities:

1. **Test across all plugins** - These are shared utilities, so changes affect all plugins using them
2. **Maintain backward compatibility** - Avoid breaking changes when possible
3. **Document breaking changes** - If unavoidable, clearly document them
4. **Update this README** - Keep documentation current with code changes

### Versioning

While this repository doesn't use semantic versioning tags, plugins reference specific commits. When making significant changes:

1. Commit your changes
2. Push to the repository
3. Update the submodule reference in each plugin that should use the new version

## Plugins Using This Submodule

- [LMSRoomReservations](https://github.com/LMSCloud/LMSRoomReservations)
- (Add other plugins as they adopt this submodule)

## Contributing

These utilities are maintained by LMSCloud. If you need to add new utilities or modify existing ones:

1. Ensure the changes are broadly applicable across multiple plugins
2. Add comprehensive documentation
3. Test in at least one plugin before pushing
4. Coordinate with the team if making breaking changes

## License

This code is part of the LMSCloud Koha plugin ecosystem and follows the same license as the Koha project (GPL v3 or later).
