import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiArrowRightUpLine,
  RiArrowUpLine,
  RiAwardLine,
  RiBookOpenLine,
  RiBriefcase4Line,
  RiBriefcaseLine,
  RiChat3Line,
  RiCloseLine,
  RiCodeSSlashLine,
  RiCornerDownLeftLine,
  RiCpuLine,
  RiDatabase2Line,
  RiDoubleQuotesL,
  RiExternalLinkLine,
  RiFacebookCircleFill,
  RiFileTextLine,
  RiFlashlightLine,
  RiFocus2Line,
  RiFolderOpenLine,
  RiGithubFill,
  RiGitRepositoryLine,
  RiGraduationCapLine,
  RiGroupLine,
  RiHome5Line,
  RiInstagramLine,
  RiInstanceLine,
  RiKeyboardLine,
  RiLinksLine,
  RiMailLine,
  RiMapPin2Line,
  RiRefreshLine,
  RiRocketLine,
  RiSearchLine,
  RiSendPlane2Fill,
  RiServerLine,
  RiShieldKeyholeLine,
  RiStarLine,
  RiTerminalWindowLine,
  RiTimeLine,
  RiUser3Line,
  RiUserLine,
  RiVolumeMuteLine,
  RiVolumeUpLine,
} from "@remixicon/react";

// Remix Icon, tree-shaken. Data files keep referring to icons by their
// familiar `ri-*` names; only the icons listed here ship in the bundle.
const ICONS = {
  "ri-add-line": RiAddLine,
  "ri-arrow-down-s-line": RiArrowDownSLine,
  "ri-arrow-left-s-line": RiArrowLeftSLine,
  "ri-arrow-right-line": RiArrowRightLine,
  "ri-arrow-right-s-line": RiArrowRightSLine,
  "ri-arrow-right-up-line": RiArrowRightUpLine,
  "ri-arrow-up-line": RiArrowUpLine,
  "ri-award-line": RiAwardLine,
  "ri-book-open-line": RiBookOpenLine,
  "ri-briefcase-4-line": RiBriefcase4Line,
  "ri-briefcase-line": RiBriefcaseLine,
  "ri-chat-3-line": RiChat3Line,
  "ri-close-line": RiCloseLine,
  "ri-code-s-slash-line": RiCodeSSlashLine,
  "ri-corner-down-left-line": RiCornerDownLeftLine,
  "ri-cpu-line": RiCpuLine,
  "ri-database-2-line": RiDatabase2Line,
  "ri-double-quotes-l": RiDoubleQuotesL,
  "ri-external-link-line": RiExternalLinkLine,
  "ri-facebook-circle-fill": RiFacebookCircleFill,
  "ri-file-text-line": RiFileTextLine,
  "ri-flashlight-line": RiFlashlightLine,
  "ri-focus-2-line": RiFocus2Line,
  "ri-folder-open-line": RiFolderOpenLine,
  "ri-github-fill": RiGithubFill,
  "ri-git-repository-line": RiGitRepositoryLine,
  "ri-graduation-cap-line": RiGraduationCapLine,
  "ri-group-line": RiGroupLine,
  "ri-home-5-line": RiHome5Line,
  "ri-instagram-line": RiInstagramLine,
  "ri-instance-line": RiInstanceLine,
  "ri-keyboard-line": RiKeyboardLine,
  "ri-links-line": RiLinksLine,
  "ri-mail-line": RiMailLine,
  "ri-map-pin-2-line": RiMapPin2Line,
  "ri-refresh-line": RiRefreshLine,
  "ri-rocket-line": RiRocketLine,
  "ri-search-line": RiSearchLine,
  "ri-send-plane-2-fill": RiSendPlane2Fill,
  "ri-server-line": RiServerLine,
  "ri-shield-keyhole-line": RiShieldKeyholeLine,
  "ri-star-line": RiStarLine,
  "ri-terminal-window-line": RiTerminalWindowLine,
  "ri-time-line": RiTimeLine,
  "ri-user-3-line": RiUser3Line,
  "ri-user-line": RiUserLine,
  "ri-volume-mute-line": RiVolumeMuteLine,
  "ri-volume-up-line": RiVolumeUpLine,
};

/**
 * Inline SVG icon. Sized with `1em` by default so the surrounding `text-*`
 * utility controls it, exactly like the icon font did; colour follows
 * `currentColor`. Decorative by default (aria-hidden) — pass `label` for a
 * meaningful icon.
 *
 * @param {object} props
 * @param {keyof typeof ICONS} props.name
 * @param {string} [props.className]
 * @param {string|number} [props.size]
 * @param {string} [props.label]
 */
export const Icon = ({ name, className, size = "1em", label, ...rest }) => {
  const Cmp = ICONS[name];
  if (!Cmp) {
    if (import.meta.env.DEV) console.warn(`Icon: unknown name "${name}"`);
    return null;
  }
  return (
    <Cmp
      size={size}
      className={className}
      data-icon={name}
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
      {...rest}
    />
  );
};
