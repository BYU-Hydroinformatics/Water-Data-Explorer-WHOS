#!/bin/bash

#  Original solution via StackOverflow:
#    http://stackoverflow.com/questions/35802939/install-only-available-packages-using-conda-install-yes-file-requirements-t
#

#
#  Install via `conda` directly.
#  This will fail to install all
#  dependencies. If one fails,
#  all dependencies will fail to install.
#
# mamba install -c conda-forge --yes --file requirements.txt
# Install mamba first
echo ${CONDA_HOME}
${CONDA_HOME}/bin/conda install -c conda-forge --yes mamba
#
#  To go around issue above, one can
#  iterate over all lines in the
#  requirements.txt file.
#
. ${CONDA_HOME}/bin/activate tethys

while read requirement; do ${CONDA_HOME}/bin/mamba install --yes $requirement || ${CONDA_HOME}/bin/pip install $requirement; done < requirements.txt